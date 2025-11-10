import type {
	INodeProperties,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { countryOptions } from '../../options/countries';

const displayConditions = {
	resource: ['nameType'],
	operation: ['properNounType'],
};

export const properNounTypeFields: INodeProperties[] = [
	{
		displayName: 'Proper Nouns to Analyze',
		name: 'properNouns',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Proper Noun',
		},
		default: {},
		placeholder: 'Add Proper Noun',
		displayOptions: {
			show: displayConditions,
		},
		options: [
			{
				name: 'nameValues',
				displayName: 'Proper Noun',
				values: [
					{
						displayName: 'Proper Noun',
						name: 'name',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'e.g. Google, Paris, John Smith',
						description:
							'The proper noun to analyze (person name, brand, location, etc.)',
					},
					{
						displayName: 'Country Code',
						name: 'countryIso2',
						type: 'options',
						default: '',
						description: 'Country context for better accuracy (ISO 3166-1 alpha-2)',
						options: countryOptions,
					},
				],
			},
		],
		description: 'Add up to 200 proper nouns for batch processing',
	},
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: displayConditions,
		},
		description:
			'Whether to return a simplified version of the response instead of the raw data',
	},
];

async function preSendFunction(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const properNouns = this.getNodeParameter('properNouns') as IDataObject;
	const nameValues = (properNouns.nameValues as IDataObject[]) || [];

	if (nameValues.length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			"Please provide at least one proper noun in the 'Proper Nouns to Analyze' parameter.",
		);
	}

	if (nameValues.length > 200) {
		throw new NodeOperationError(
			this.getNode(),
			'Namsor API supports maximum 200 items per request. Please reduce the number of proper nouns to 200 or fewer.',
		);
	}

	// Detect if we're using geo mode
	const useGeo = nameValues.some((n: IDataObject) => n.countryIso2);

	// Modify URL based on mode
	if (useGeo) {
		requestOptions.url = '/api2/json/nameTypeGeoBatch';
	} else {
		requestOptions.url = '/api2/json/nameTypeBatch';
	}

	const properNounsList = nameValues
		.filter((n: IDataObject) => n.name)
		.map((n: IDataObject) => {
			const entry: IDataObject = {
				name: n.name?.toString() || '',
			};

			if (useGeo && n.countryIso2) {
				entry.countryIso2 = n.countryIso2.toString();
			}

			return entry;
		});

	// Note: Use 'properNouns' instead of 'personalNames' for this endpoint
	requestOptions.body = { properNouns: properNounsList };
	return requestOptions;
}

async function postReceiveFunction(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const simplify = this.getNodeParameter('simplify', 0) as boolean;

	if (!simplify) {
		return items;
	}

	// Extract properNouns array from the API response (nameType uses properNouns, not personalNames)
	const responseData = items[0]?.json?.properNouns as IDataObject[];

	if (!responseData || !Array.isArray(responseData)) {
		return items;
	}

	return responseData.map((nameData) => ({
		json: {
			name: nameData.name,
			commonType: nameData.commonType,
			commonTypeAlt: nameData.commonTypeAlt,
		},
		pairedItem: { item: 0 },
	}));
}

export const properNounTypeDescription = {
	preSend: preSendFunction,
	postReceive: postReceiveFunction,
};
