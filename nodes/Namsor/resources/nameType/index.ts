import type { INodeProperties } from 'n8n-workflow';
import { properNounTypeDescription, properNounTypeFields } from './properNounType';

const resource = 'nameType';

export const nameTypeDescription: INodeProperties[] = [
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
				name: 'Proper Noun Type',
				value: 'properNounType',
				action: 'Identify proper noun type',
				description:
					'Identify the most likely name type (anthroponym, brand name, toponym, pseudonym)',
				routing: {
					request: {
						method: 'POST',
						url: '/api2/json/nameTypeBatch', // Will be modified by preSend if geo mode
					},
					send: {
						preSend: [properNounTypeDescription.preSend],
					},
					output: {
						postReceive: [properNounTypeDescription.postReceive],
					},
				},
			},
		],
		default: 'properNounType',
	},
	...properNounTypeFields,
];
