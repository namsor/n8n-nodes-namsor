import type { INodeProperties } from 'n8n-workflow';
import { splitFullNamesDescription, splitFullNamesFields } from './splitFullNames';

const resource = 'nameParsing';

export const nameParsingDescription: INodeProperties[] = [
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
		options: [
			{
				name: 'Split Full Names',
				value: 'splitFullNames',
				action: 'Split full names into first and last',
				description: 'Parse a full name into first name and last name components',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/parseNameBatch', // Will be modified by preSend if geo mode
					},
					send: {
						preSend: [splitFullNamesDescription.preSend],
					},
					output: {
						postReceive: [splitFullNamesDescription.postReceive],
					},
				},
			},
		],
		default: 'splitFullNames',
	},
	...splitFullNamesFields,
];
