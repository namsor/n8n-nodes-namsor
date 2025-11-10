import type { INodeProperties } from 'n8n-workflow';
import { indianCasteByNameDescription, indianCasteByNameFields } from './byName';
import { indianCasteByFullNameDescription, indianCasteByFullNameFields } from './byFullName';

const resource = 'indianCaste';

export const indianCasteDescription: INodeProperties[] = [
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
        description: 'Choose how you provide the name(s) for Indian caste prediction',
		options: [
			{
				name: 'Predict by Name',
				value: 'byName',
				action: 'Predict indian caste by name',
				description: 'Predict the Indian caste group based on first and last name',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/castegroupIndianBatch',
					},
					send: {
						preSend: [indianCasteByNameDescription.preSend],
					},
					output: {
						postReceive: [indianCasteByNameDescription.postReceive],
					},
				},
			},
			{
				name: 'Predict by Full Name',
				value: 'byFullName',
				action: 'Predict indian caste by full name',
				description: 'Predict the Indian caste group from a complete name string',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/castegroupIndianFullBatch',
					},
					send: {
						preSend: [indianCasteByFullNameDescription.preSend],
					},
					output: {
						postReceive: [indianCasteByFullNameDescription.postReceive],
					},
				},
			},
		],
		default: 'byName',
	},
	...indianCasteByNameFields,
	...indianCasteByFullNameFields,
];
