import type { INodeProperties } from 'n8n-workflow';
import { ethnicityByNameDescription, ethnicityByNameFields } from './byName';
import { ethnicityByFullNameDescription, ethnicityByFullNameFields } from './byFullName';

const resource = 'ethnicity';

export const ethnicityDescription: INodeProperties[] = [
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
        description: 'Choose how you provide the name(s) for ethnicity prediction',
		options: [
			{
				name: 'Predict by Name',
				value: 'byName',
				action: 'Predict ethnicity by name',
				description: 'Predict the ethnicity based on first and last name',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/diasporaBatch',
					},
					send: {
						preSend: [ethnicityByNameDescription.preSend],
					},
					output: {
						postReceive: [ethnicityByNameDescription.postReceive],
					},
				},
			},
			{
				name: 'Predict by Full Name',
				value: 'byFullName',
				action: 'Predict ethnicity by full name',
				description: 'Predict the ethnicity from a complete name string',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/diasporaFullBatch',
					},
					send: {
						preSend: [ethnicityByFullNameDescription.preSend],
					},
					output: {
						postReceive: [ethnicityByFullNameDescription.postReceive],
					},
				},
			},
		],
		default: 'byName',
	},
	...ethnicityByNameFields,
	...ethnicityByFullNameFields,
];
