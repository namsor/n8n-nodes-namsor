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
	resource: ['usRaceEthnicity'],
	operation: ['byFullName'],
};

export const usRaceEthnicityByFullNameFields: INodeProperties[] = [
	{
		displayName: 'Names to Analyze',
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
						description: 'The complete name to analyze',
					},
					{
						displayName: 'Country Code',
						name: 'countryIso2',
						type: 'options',
						default: '',
						description: 'Country context (U.S. by default, ISO 3166-1 alpha-2).',
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
			"Please provide at least one name in the 'Names to Analyze' parameter.",
		);
	}

	if (nameValues.length > 200) {
		throw new NodeOperationError(
			this.getNode(),
			'Namsor API supports maximum 200 names per request. Please reduce the number of names to 200 or fewer.',
		);
	}

	const personalNames = nameValues
		.filter((n: IDataObject) => n.name)
		.map((n: IDataObject) => {
			const entry: IDataObject = {
				name: n.name?.toString() || '',
			};

			if (n.countryIso2) {
				entry.countryIso2 = n.countryIso2.toString();
			}

			return entry;
		});

	requestOptions.body = { personalNames };

	// Add special header for US Race/Ethnicity taxonomy
	requestOptions.headers = {
		...requestOptions.headers,
		'X-OPTION-USRACEETHNICITY-TAXONOMY': 'USRACEETHNICITY-6CLASSES',
	};

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
		const json: IDataObject = {
			name: nameData.name,
			probability: nameData.probabilityCalibrated,
		};

		// Add country code if available
		if (nameData.countryIso2) {
			json.countryIso2 = nameData.countryIso2;
		}

		// Transform raceEthnicitiesTop array into individual fields (6 classes)
		const raceTop = (nameData.raceEthnicitiesTop as string[]) || [];
		// First ethnicity is also available as raceEthnicity
		json.ethnicity = nameData.raceEthnicity || raceTop[0];
		// Add remaining classes
		for (let i = 1; i < 6; i++) {
			if (raceTop[i]) {
				json[`ethnicity${i + 1}`] = raceTop[i];
			}
		}

		return {
			json,
			pairedItem: { item: 0 },
		};
	});
}

export const usRaceEthnicityByFullNameDescription = {
	preSend: preSendFunction,
	postReceive: postReceiveFunction,
};
