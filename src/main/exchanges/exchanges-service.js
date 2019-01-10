'use strict';
import fetch from 'node-fetch';
import Exchange from './exchange';
import { getGlobalContext } from 'common/context';
const { exchangesOperations } = require('common/exchanges');

const airtableBaseUrl =
	'https://us-central1-kycchain-master.cloudfunctions.net/airtable?tableName=';

export class ExchangesService {
	async loadExchangeData() {
		const response = await fetch(`${airtableBaseUrl}Exchanges`);

		const responseBody = await response.json();

		const exchanges = responseBody.entities
			.filter(row => row.data && row.data.name)
			.map(row => ({
				name: row.data.name,
				data: row.data
			}));

		await Exchange.import(exchanges);
		const importedExchanges = await Exchange.findAll();
		const store = getGlobalContext().store;
		return store.dispatch(exchangesOperations.updateExchanges(importedExchanges));
	}
}

export default ExchangesService;
