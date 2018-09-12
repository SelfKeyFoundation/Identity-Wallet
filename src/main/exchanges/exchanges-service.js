'use strict';
import fetch from 'node-fetch';
import Exchange from './exchange';

const airtableBaseUrl =
	'https://us-central1-kycchain-master.cloudfunctions.net/airtable?tableName=';

export class ExchangesService {
	async loadExchangeData() {
		const response = await fetch(`${airtableBaseUrl}Exchanges`);

		const responseBody = await response.json();

		const exchanges = responseBody.entities
			.filter(row => row.data && row.data.fields && row.data.fields.name)
			.map(row => ({
				name: row.data.fields.name,
				data: row.data.fields
			}));

		return Exchange.import(exchanges);
	}
}

export default ExchangesService;
