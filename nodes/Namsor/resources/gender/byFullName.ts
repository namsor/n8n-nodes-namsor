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
	resource: ['gender'],
	operation: ['byFullName'],
};

export const genderByFullNameFields: INodeProperties[] = [
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

// Fonction preSend
async function preSendFunction(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const fullNames = this.getNodeParameter('fullNames') as IDataObject;
	const nameValues = (fullNames.nameValues as IDataObject[]) || [];

	// Validation: au moins 1 nom
	if (nameValues.length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			"Please provide at least one name in the 'Names to Analyze' parameter.",
		);
	}

	// Validation: max 200 noms
	if (nameValues.length > 200) {
		throw new NodeOperationError(
			this.getNode(),
			'Namsor API supports maximum 200 names per request. Please reduce the number of names to 200 or fewer.',
		);
	}

	// Détecter si on utilise le mode geo
	const useGeo = nameValues.some((n: IDataObject) => n.countryIso2);

	// Modifier l'URL en fonction du mode
	if (useGeo) {
		requestOptions.url = '/api2/json/genderFullGeoBatch';
	} else {
		requestOptions.url = '/api2/json/genderFullBatch';
	}

	// Construire le body
	const personalNames = nameValues
		.filter((n: IDataObject) => n.name) // Filtrer les entrées sans name
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

// Fonction postReceive
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

	// Simplifier les résultats
	return responseData.map((nameData) => ({
		json: {
			name: nameData.name,
			gender: nameData.likelyGender,
			probability: nameData.probabilityCalibrated,
		},
		pairedItem: { item: 0 },
	}));
}

export const genderByFullNameDescription = {
	preSend: preSendFunction,
	postReceive: postReceiveFunction,
};
