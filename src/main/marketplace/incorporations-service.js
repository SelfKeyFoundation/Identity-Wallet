'use strict';

import request from 'request';
import { Logger } from 'common/logger';
import config from 'common/config';

const log = new Logger('marketplace-incorporations-service');

const URL = config.incorporationApiUrl;
const TREATIES_URL = config.incorporationTreatiesUrl;
const COUNTRY_INFO_URL = config.countryInfoUrl;

export class IncorporationsService {
	loadIncorporations() {
		return new Promise((resolve, reject) => {
			log.debug(`Loading incorporations main API data: ${URL}`);
			request.get({ url: URL, json: true }, (error, httpResponse, response) => {
				if (error) {
					log.error(error);
					return reject(error);
				} else {
					const {
						Main,
						Corporations,
						LLCs,
						Taxes,
						Foundations,
						Trusts,
						EN
						// Guarantee
					} = response;
					const payload = {};

					payload.incorporations = Main.map(inc => {
						const fields = inc.data.fields;
						const newInc = { ...fields, id: inc.data.id };

						return newInc;
					});

					const corpMap = corp => {
						const fields = corp.data.fields;
						const newCorp = { ...fields, id: corp.data.id };

						return newCorp;
					};

					payload.corporations = Corporations.map(corpMap);
					payload.llcs = LLCs.map(corpMap);
					payload.foundations = Foundations.map(corpMap);
					payload.trusts = Trusts.map(corpMap);

					payload.translation = EN.map(translation => {
						const fields = translation.data.fields;
						const newTranslation = { ...fields, id: translation.data.id };
						return newTranslation;
					});

					payload.taxes = Taxes.map(tax => {
						const fields = tax.data.fields;
						const newTax = { ...fields, id: tax.data.id };

						return newTax;
					});
					resolve(payload);
				}
			});
		});
	}

	loadTreatiesData(countryCode) {
		return new Promise((resolve, reject) => {
			log.debug(
				`Loading incorporations tax treaties API data for country ${countryCode}: ${TREATIES_URL}/${countryCode}`
			);
			request.get(
				{ url: `${TREATIES_URL}/${countryCode}`, json: true },
				(error, httpResponse, response) => {
					if (error) {
						log.error(error);
						reject(error);
					} else {
						const payload = {};
						const treaties = response[0];

						payload.treaties = treaties.map(t => {
							const newTreaties = { ...t };
							return newTreaties;
						});
						payload.countryCode = countryCode;

						resolve(payload);
					}
				}
			);
		});
	}

	loadCountryInfo(countryCode) {
		return new Promise((resolve, reject) => {
			log.debug(
				`Loading incorporations country details for ${countryCode}: ${COUNTRY_INFO_URL}/${countryCode}`
			);
			request.get(
				{ url: `${COUNTRY_INFO_URL}/${countryCode}`, json: true },
				(error, httpResponse, response) => {
					if (error) {
						log.error(error);
						reject(error);
					} else {
						const payload = {};
						const country = response;

						payload.country = country.map(c => {
							const newCountry = { ...c };
							return newCountry;
						});

						payload.countryCode = countryCode;
						resolve(payload);
					}
				}
			);
		});
	}
}

export default IncorporationsService;
