import type {
	INodeProperties,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { indiaSubdivisionOptions } from '../../options/indiaSubdivisions';

const displayConditions = {
	resource: ['indianCaste'],
	operation: ['byName'],
};

export const indianCasteByNameFields: INodeProperties[] = [
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
						required: true,
						default: '',
						placeholder: 'e.g. Ravi',
						description: 'The first name to analyze',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'e.g. Kumar',
						description: 'The last name to analyze',
					},
					{
						displayName: 'Indian State or Union Territory',
						name: 'subdivisionIso',
						type: 'options',
						required: true,
						default: '',
						description: 'Indian state or union territory (ISO 3166-2:IN)',
						options: indiaSubdivisionOptions,
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
		.filter((n: IDataObject) => n.firstName && n.lastName && n.subdivisionIso)
		.map((n: IDataObject) => ({
			firstName: n.firstName?.toString() || '',
			lastName: n.lastName?.toString() || '',
			subdivisionIso: n.subdivisionIso?.toString() || '',
		}));

	if (personalNames.length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			'Please provide First Name, Last Name, and Indian Subdivision for each entry.',
		);
	}

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
			subdivisionIso: nameData.subdivisionIso,
			castegroup: nameData.castegroup,
			probability: nameData.probabilityCalibrated,
		};

		// Transform castegroupTop array into individual fields
		const castegroupTop = (nameData.castegroupTop as string[]) || [];
		// Index 0 is the main castegroup (already in json.castegroup)
		// Add remaining caste groups
		for (let i = 1; i < 5; i++) {
			if (castegroupTop[i]) {
				json[`castegroup${i + 1}`] = castegroupTop[i];
			}
		}

		return {
			json,
			pairedItem: { item: 0 },
		};
	});
}

export const indianCasteByNameDescription = {
	preSend: preSendFunction,
	postReceive: postReceiveFunction,
};
