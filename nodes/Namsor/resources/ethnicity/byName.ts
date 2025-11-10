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
	resource: ['ethnicity'],
	operation: ['byName'],
};

export const ethnicityByNameFields: INodeProperties[] = [
	{
		displayName: 'Names to Analyze',
		name: 'names',
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
						displayName: 'First Name',
						name: 'firstName',
						type: 'string',
						default: '',
						placeholder: 'e.g. John',
						description: 'The first name to analyze',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'e.g. Smith',
						description: 'The last name to analyze',
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
	const names = this.getNodeParameter('names') as IDataObject;
	const nameValues = (names.nameValues as IDataObject[]) || [];

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
		.filter((n: IDataObject) => n.lastName)
		.map((n: IDataObject) => {
			const entry: IDataObject = {
				lastName: n.lastName?.toString() || '',
			};

			if (n.firstName) {
				entry.firstName = n.firstName.toString();
			}

			if (n.countryIso2) {
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
		const json: IDataObject = {
			firstName: nameData.firstName,
			lastName: nameData.lastName,
			probability: nameData.probabilityCalibrated,
		};

		const ethnicities = (nameData.ethnicitiesTop as string[]) || [];
		ethnicities.forEach((ethnicity, index) => {
			json[`ethnicity${index === 0 ? '' : index + 1}`] = ethnicity;
		});

		return {
			json,
			pairedItem: { item: 0 },
		};
	});
}

export const ethnicityByNameDescription = {
	preSend: preSendFunction,
	postReceive: postReceiveFunction,
};
