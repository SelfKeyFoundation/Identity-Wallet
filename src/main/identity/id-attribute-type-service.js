'use strict';
import fetch from 'node-fetch';
import IdAttributeType from './id-attribute-type';

const airtableBaseUrl = 'https://alpha.selfkey.org/marketplace/i/api/';

export class IdAttributeTypeService {
	static async loadIdAttributeTypes() {
		const result = await fetch(`${airtableBaseUrl}id-attributes`);

		const response = await result.json();

		const idAttributeData = response.ID_Attributes.filter(attr => attr.data).map(
			attr => attr.data.fields
		);

		return IdAttributeType.import(idAttributeData);
	}
}

export default IdAttributeTypeService;
