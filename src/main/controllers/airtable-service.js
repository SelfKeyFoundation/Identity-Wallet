'use strict';
const fetch = require('node-fetch');
const IdAttributeType = require('../models/id-attribute-type');
const Exchange = require('../models/exchange');
const airtableBaseUrl = 'https://alpha.selfkey.org/marketplace/i/api/';

module.exports = {
	loadIdAttributeTypes: async () => {
		const result = await fetch(`${airtableBaseUrl}id-attributes`);

		const response = await result.json();

		const idAttributeData = response.ID_Attributes.filter(attr => attr.data).map(
			attr => attr.data.fields
		);

		return IdAttributeType.import(idAttributeData);
	},

	loadExchangeData: async () => {
		const response = await fetch(`${airtableBaseUrl}Exchanges`);

		const responseBody = await response.json();

		const exchanges = responseBody.Exchanges.filter(
			row => row.data && row.data.fields.name
		).map(row => ({
			name: row.data.fields.name,
			data: JSON.stringify(row.data.fields)
		}));

		return Exchange.import(exchanges);
	}
};
