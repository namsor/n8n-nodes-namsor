import type { INodeProperties } from 'n8n-workflow';
import { genderByNameDescription, genderByNameFields } from './byName';
import { genderByFullNameDescription, genderByFullNameFields } from './byFullName';

const resource = 'gender';

export const genderDescription: INodeProperties[] = [
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
        description: 'Choose how you provide the name(s) for gender prediction',
		options: [
			{
				name: 'Predict by Name',
				value: 'byName',
				action: 'Predict gender by name',
				description: 'Predict the gender based on first and last name',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/genderBatch', // Will be modified by preSend
					},
					send: {
						preSend: [genderByNameDescription.preSend],
					},
					output: {
						postReceive: [genderByNameDescription.postReceive],
					},
				},
			},
			{
				name: 'Predict by Full Name',
				value: 'byFullName',
				action: 'Predict gender by full name',
				description: 'Predict the gender from a complete name string',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/genderFullBatch', // Will be modified by preSend
					},
					send: {
						preSend: [genderByFullNameDescription.preSend],
					},
					output: {
						postReceive: [genderByFullNameDescription.postReceive],
					},
				},
			},
		],
		default: 'byName',
	},
	...genderByNameFields,
	...genderByFullNameFields,
];
