import type { INodeProperties } from 'n8n-workflow';
import { usRaceEthnicityByNameDescription, usRaceEthnicityByNameFields } from './byName';
import {
	usRaceEthnicityByFullNameDescription,
	usRaceEthnicityByFullNameFields,
} from './byFullName';

const resource = 'usRaceEthnicity';

export const usRaceEthnicityDescription: INodeProperties[] = [
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
        description: 'Choose how you provide the name(s) for US race/ethnicity prediction',
		options: [
			{
				name: 'Predict by Name',
				value: 'byName',
				action: 'Predict us race ethnicity by name',
				description: 'Predict the US census race/ethnicity based on first and last name',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/usRaceEthnicityBatch',
					},
					send: {
						preSend: [usRaceEthnicityByNameDescription.preSend],
					},
					output: {
						postReceive: [usRaceEthnicityByNameDescription.postReceive],
					},
				},
			},
			{
				name: 'Predict by Full Name',
				value: 'byFullName',
				action: 'Predict us race ethnicity by full name',
				description: 'Predict the US census race/ethnicity from a complete name string',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/usRaceEthnicityFullBatch',
					},
					send: {
						preSend: [usRaceEthnicityByFullNameDescription.preSend],
					},
					output: {
						postReceive: [usRaceEthnicityByFullNameDescription.postReceive],
					},
				},
			},
		],
		default: 'byName',
	},
	...usRaceEthnicityByNameFields,
	...usRaceEthnicityByFullNameFields,
];
