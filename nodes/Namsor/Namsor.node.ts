import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { genderDescription } from './resources/gender';
import { originDescription } from './resources/origin';
import { ethnicityDescription } from './resources/ethnicity';
import { countryDescription } from './resources/country';
import { usRaceEthnicityDescription } from './resources/usRaceEthnicity';
import { indianCasteDescription } from './resources/indianCaste';
import { nameParsingDescription } from './resources/nameParsing';
import { nameTypeDescription } from './resources/nameType';

export class Namsor implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Namsor',
		name: 'namsor',
		icon: { light: 'file:namsor.svg', dark: 'file:namsor.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'AI-powered name analysis and ethnicity prediction using the Namsor API',
		defaults: {
			name: 'Namsor',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'namsorApi', required: true }],
		requestDefaults: {
			baseURL: 'https://v2.namsor.com/NamSorAPIv2',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,		
				description: 'Select the feature category you want to use',
				options: [
					{
						name: 'Country',
						value: 'country',
						description: 'Predict country of residence from a name'
					},
					{
						name: 'Ethnicity',
						value: 'ethnicity',
						description: 'Predict ethnicity/diaspora from a name'
					},
					{
						name: 'Gender',
						value: 'gender',
						description: 'Predict likely gender from a name'
					},
					{
						name: 'Indian Caste',
						value: 'indianCaste',
						description: 'Predict Indian caste group from a name'
					},
					{
						name: 'Name Parsing',
						value: 'nameParsing',
						description: 'Split a full name into first and last name'
					},
					{
						name: 'Name Type',
						value: 'nameType',
						description: 'Identify the most likely name type (anthroponym, brand name, toponym)'
					},
					{
						name: 'Origin',
						value: 'origin',
						description: 'Predict country of origin from a name'
					},
					{
						name: 'US Race/Ethnicity',
						value: 'usRaceEthnicity',
						description: 'Predict US census race/ethnicity classes'
					},
				],
				default: 'gender',
			},
			...genderDescription,
			...originDescription,
			...ethnicityDescription,
			...countryDescription,
			...usRaceEthnicityDescription,
			...indianCasteDescription,
			...nameParsingDescription,
			...nameTypeDescription,
		],
	};
}
