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
	resource: ['nameParsing'],
	operation: ['splitFullNames'],
};

export const splitFullNamesFields: INodeProperties[] = [
	{
		displayName: 'Names to Parse',
		name: 'fullNames',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Name',
		},
		default: {},
		placeholder: 'Add Name',
		displayOptions: {
			show: displayConditions,
		},
		options: [
			{
				name: 'nameValues',
				displayName: 'Name',
				values: [
					{
						displayName: 'Full Name',
						name: 'name',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'e.g. John Smith',
						description: 'The complete name to parse into first and last name',
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
		description: 'Add up to 200 names for batch processing',
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
	const fullNames = this.getNodeParameter('fullNames') as IDataObject;
	const nameValues = (fullNames.nameValues as IDataObject[]) || [];

	if (nameValues.length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			"Please provide at least one name in the 'Names to Parse' parameter.",
		);
	}

	if (nameValues.length > 200) {
		throw new NodeOperationError(
			this.getNode(),
			'Namsor API supports maximum 200 names per request. Please reduce the number of names to 200 or fewer.',
		);
	}

	// Detect if we're using geo mode
	const useGeo = nameValues.some((n: IDataObject) => n.countryIso2);

	// Modify URL based on mode
	if (useGeo) {
		requestOptions.url = '/api2/json/parseNameGeoBatch';
	} else {
		requestOptions.url = '/api2/json/parseNameBatch';
	}

	const personalNames = nameValues
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

	requestOptions.body = { personalNames };
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

	// Extract personalNames array from the API response
	const responseData = items[0]?.json?.personalNames as IDataObject[];

	if (!responseData || !Array.isArray(responseData)) {
		return items;
	}

	return responseData.map((nameData) => {
		const firstLastName = (nameData.firstLastName as IDataObject) || {};

		return {
			json: {
				name: nameData.name,
				firstName: firstLastName.firstName,
				lastName: firstLastName.lastName,
			},
			pairedItem: { item: 0 },
		};
	});
}

export const splitFullNamesDescription = {
	preSend: preSendFunction,
	postReceive: postReceiveFunction,
};
