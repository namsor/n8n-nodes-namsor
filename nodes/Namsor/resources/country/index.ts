import type { INodeProperties } from 'n8n-workflow';
import { countryByNameDescription, countryByNameFields } from './byName';
import { countryByFullNameDescription, countryByFullNameFields } from './byFullName';

const resource = 'country';

export const countryDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [resource],
			},
		},
        description: 'Choose how you provide the name(s) for country of residence prediction',
		options: [
			{
				name: 'Predict by Name',
				value: 'byName',
				action: 'Predict country of residence by name',
				description: 'Predict the country of residence based on first and last name',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/countryFnLnBatch',
					},
					send: {
						preSend: [countryByNameDescription.preSend],
					},
					output: {
						postReceive: [countryByNameDescription.postReceive],
					},
				},
			},
			{
				name: 'Predict by Full Name',
				value: 'byFullName',
				action: 'Predict country of residence by full name',
				description: 'Predict the country of residence from a complete name string',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/countryBatch',
					},
					send: {
						preSend: [countryByFullNameDescription.preSend],
					},
					output: {
						postReceive: [countryByFullNameDescription.postReceive],
					},
				},
			},
		],
		default: 'byName',
	},
	...countryByNameFields,
	...countryByFullNameFields,
];
