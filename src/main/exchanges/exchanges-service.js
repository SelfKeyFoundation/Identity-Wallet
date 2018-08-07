'use strict';
import fetch from 'node-fetch';
import Exchange from './exchange';

const airtableBaseUrl = 'https://alpha.selfkey.org/marketplace/i/api/';

export class ExchangesService {
	static async loadExchangeData() {
		const response = await fetch(`${airtableBaseUrl}Exchanges`);

		const responseBody = await response.json();

		const exchanges = responseBody.Exchanges.filter(
			row => row.data && row.data.fields.name
		).map(row => ({
			name: row.data.fields.name,
			data: row.data.fields
		}));

		return Exchange.import(exchanges);
	}
}

export default ExchangesService;
