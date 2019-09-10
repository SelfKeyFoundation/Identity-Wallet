import config from 'common/config';
import { MarketplaceCountry } from './marketplace-country';
import request from 'request-promise-native';
import { isDevMode } from 'common/utils/common';
import urljoin from 'url-join';
import _ from 'lodash';
import { Logger } from '../../../common/logger';
import { MARKETPLACE_COUNTRY_SYNC_JOB } from './marketplace-country-sync-job-handler';

const log = new Logger('TaxTreatiesService');

export const FLAGTHEORY_COUNTRY_ENDPOINT = config.countryInfoUrl;
export const FLAGTHEORY_ALL_COUNTRIES_ENDPOINT = config.allCountriesInfoUrl;

export const COUNTRY_API_ENDPOINT = `${config.airtableBaseUrl}Countries${isDevMode() ? 'Dev' : ''}`;

export class MarketplaceCountryService {
	constructor({ taxTreatiesService, schedulerService }) {
		this.taxTreatiesService = taxTreatiesService;
		this.schedulerService = schedulerService;
	}
	async fetchMarketplaceCountries() {
		const sk = await this.fetchMarketplaceCountriesSelfkey();
		const ft = await this.fetchMarketplaceCountriesFlagtheory(sk.map(c => c.code));
		const countries = ft.concat(sk);
		return countries;
	}
	async fetchMarketplaceCountriesSelfkey() {
		try {
			let fetched = await request.get({ url: COUNTRY_API_ENDPOINT, json: true });
			return fetched.entities
				.filter(e => Object.keys(e.data).length)
				.map(entity => {
					console.log(entity);
					entity = _.mapKeys(entity.data, (value, key) => _.camelCase(key));
					entity.languages = entity.languages.split(',');
					return entity;
				});
		} catch (error) {
			log.error(error);
			return [];
		}
	}
	async fetchMarketplaceCountriesFlagtheory(filter = []) {
		const fetched = await this.fetchAllFlagtheoryCountries();

		const countries = Object.keys(fetched)
			.filter(countryCode => !filter.includes(countryCode))
			.map(countryCode => {
				return this.parseCountry(fetched[countryCode]);
			});

		return countries;
	}

	async populateCountryListFlagtheory(countries) {
		return (await Promise.all(countries.map(c => this.fetchOneFlagtheoryCountry(c)))).filter(
			c => !!c
		);
	}

	async fetchAllFlagtheoryCountries() {
		try {
			let countries = await request.get({
				url: FLAGTHEORY_ALL_COUNTRIES_ENDPOINT,
				json: true
			});
			return countries;
		} catch (error) {
			log.error(error);
			return {};
		}
	}

	async fetchOneFlagtheoryCountry(code) {
		try {
			let country = await request.get({
				url: urljoin(FLAGTHEORY_COUNTRY_ENDPOINT, code),
				json: true
			});
			return this.parseCountry(country[0]);
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	parseCountry(country) {
		country = _.mapKeys(_.omit(country, 'id'), (value, key) => _.camelCase(key));
		country.languages = (country.languages || '').split(',').filter(l => !!l);
		country.population = +country.population || 0;
		country.geonameId = '' + country.geonameId || null;
		return country;
	}

	start() {
		this.schedulerService.queueJob(null, MARKETPLACE_COUNTRY_SYNC_JOB);
	}

	loadCountries() {
		return MarketplaceCountry.findAll();
	}
	upsert(upsert) {
		return MarketplaceCountry.bulkUpsert(upsert);
	}
	deleteMany(ids) {
		return MarketplaceCountry.deleteMany(ids);
	}
}

export default MarketplaceCountryService;
