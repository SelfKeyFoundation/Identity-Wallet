'use strict';
import fetch from 'node-fetch';
import Exchange from './exchange';
import ListingExchange from './listing-exchange';
import { isDevMode } from 'common/utils/common';
import { Logger } from 'common/logger';
import { LISTING_EXCHANGES_SYNC_JOB } from './listing-exchanges-sync-job-handler';

const log = new Logger('ExchangesService');
const { exchangesOperations } = require('common/exchanges');

const airtableBaseUrl =
	'https://us-central1-kycchain-master.cloudfunctions.net/airtable?tableName=';

export class ExchangesService {
	constructor({ schedulerService, store }) {
		this.schedulerService = schedulerService;
		this.store = store;
	}
	async start() {
		const now = new Date();
		this.schedulerService.queueJob(
			null,
			LISTING_EXCHANGES_SYNC_JOB,
			now.setMinutes(now.getMinutes() + 1)
		);
	}
	async loadExchangeData() {
		log.debug(`Fetching exchanges from ${airtableBaseUrl}Exchanges${isDevMode() ? 'Dev' : ''}`);
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

		await Exchange.import(exchanges);
		const importedExchanges = await Exchange.findAll();
		return this.store.dispatch(exchangesOperations.updateExchanges(importedExchanges));
	}

	loadListingExchanges() {
		return ListingExchange.findAll();
	}

	async syncListingExchanges() {
		log.debug(
			`Fetching listing exchanges from ${airtableBaseUrl}ExchangeListingsKey${
				isDevMode() ? 'Dev' : ''
			}`
		);
		const response = await fetch(
			`${airtableBaseUrl}ExchangeListingsKey${isDevMode() ? 'Dev' : ''}`
		);

		const responseBody = await response.json();
		const exchanges = responseBody.entities
			.filter(row => row.data && row.data.name)
			.map(row => {
				const { name, url, trade_url: tradeUrl, region, pairs, comment } = row.data;

				return {
					name,
					url,
					tradeUrl,
					region,
					pairs,
					comment
				};
			});

		await ListingExchange.import(exchanges);
		const importedExchanges = await ListingExchange.findAll();
		return importedExchanges;
	}
}

export default ExchangesService;
