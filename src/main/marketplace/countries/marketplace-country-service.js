import config from 'common/config';
import { MarketplaceCountry } from './marketplace-country';
import request from 'request-promise-native';
import { isDevMode } from 'common/utils/common';
import urljoin from 'url-join';
import _ from 'lodash';
import { Logger } from '../../../common/logger';

const log = new Logger('TaxTreatiesService');

export const FLAGTHEORY_COUNTRY_ENDPOINT = config.incorporationTreatiesUrl;

export const COUNTRY_API_ENDPOINT = `${config.airtableBaseUrl}Countries${isDevMode() ? 'Dev' : ''}`;

export class MarketplaceCountryService {
	constructor({ taxTreatiesService }) {
		this.taxTreatiesService = taxTreatiesService;
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
			return fetched.entities.map(entity => {
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
		try {
			let fetched = await this.taxTreatiesService.fetchTaxTreaties();

			fetched = [
				...new Set(
					fetched[0].reduce((acc, curr) => {
						acc.push(curr.countryCode);
						acc.push(curr.jurisdictionCountryCode);
						return acc;
					}, [])
				)
			].filter(c => !filter.includes(c));

			return this.populateCountryListFlagtheory(fetched);
		} catch (error) {
			log.error(error);
			console.log(error);
			return [];
		}
	}

	async populateCountryListFlagtheory(countries) {
		return (await Promise.all(countries.map(c => this.fetchOneFlagtheoryCountry(c)))).filter(
			c => !!c
		);
	}

	async fetchOneFlagtheoryCountry(code) {
		try {
			let country = await request.get({
				url: urljoin(FLAGTHEORY_COUNTRY_ENDPOINT, code),
				json: true
			});
			country = _.mapKeys(_.omit(country[0], 'id'), (value, key) => _.camelCase(key));
			country.languages = country.languages.split(',');
			return country;
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	start() {}

	loadInventory() {
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
