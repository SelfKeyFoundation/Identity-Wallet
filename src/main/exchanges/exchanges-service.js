'use strict';
import fetch from 'node-fetch';
import Exchange from './exchange';
import { isDevMode } from 'common/utils/common';
import { Logger } from 'common/logger';

const log = new Logger('ExchangesService');

const airtableBaseUrl =
	'https://us-central1-kycchain-master.cloudfunctions.net/airtable?tableName=';

export class ExchangesService {
	async loadExchangeData() {
		log.info(`Fetching exchanges from ${airtableBaseUrl}Exchanges${isDevMode() ? 'Dev' : ''}`);
		const response = await fetch(`${airtableBaseUrl}Exchanges${isDevMode() ? 'Dev' : ''}`);

		const responseBody = await response.json();
		const exchanges = responseBody.entities
			.filter(row => row.data && row.data.name)
			.map(row => {
				const { data } = row;
				if (data.relying_party_config) {
					try {
						data.relying_party_config = JSON.parse(data.relying_party_config);
					} catch (error) {
						log.error(error);
					}
				}
				return {
					name: data.name,
					data: data
				};
			});

		return Exchange.import(exchanges);
	}
}

export default ExchangesService;
