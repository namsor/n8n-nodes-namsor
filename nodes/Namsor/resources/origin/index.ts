import type { INodeProperties } from 'n8n-workflow';
import { originByNameDescription, originByNameFields } from './byName';
import { originByFullNameDescription, originByFullNameFields } from './byFullName';

const resource = 'origin';

export const originDescription: INodeProperties[] = [
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
        description: 'Choose how you provide the name(s) for origin prediction',
		options: [
			{
				name: 'Predict by Name',
				value: 'byName',
				action: 'Predict origin by name',
				description: 'Predict the geographic origin based on first and last name',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/originBatch',
					},
					send: {
						preSend: [originByNameDescription.preSend],
					},
					output: {
						postReceive: [originByNameDescription.postReceive],
					},
				},
			},
			{
				name: 'Predict by Full Name',
				value: 'byFullName',
				action: 'Predict origin by full name',
				description: 'Predict the geographic origin from a complete name string',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/originFullBatch',
					},
					send: {
						preSend: [originByFullNameDescription.preSend],
					},
					output: {
						postReceive: [originByFullNameDescription.postReceive],
					},
				},
			},
		],
		default: 'byName',
	},
	...originByNameFields,
	...originByFullNameFields,
];
