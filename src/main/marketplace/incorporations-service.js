'use strict';

import request from 'request';

import { Logger } from 'common/logger';

const log = new Logger('marketplace-incorporations-service');

// FIXME: hard coded URL
const URL = 'https://passports.io/api/incorporations';
const TREATIES_URL = 'https://passports.io/api/tax-treaties';
const COUNTRY_INFO_URL = 'https://passports.io/api/country';

export class IncorporationsService {
	loadIncorporations() {
		return new Promise((resolve, reject) => {
			log.info('Loading incorporations main API data');
			request.get({ url: URL, json: true }, (error, httpResponse, response) => {
				if (error) {
					log.error(error);
					return reject(error);
				}
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

					/* newInc.id = inc.data.id;
					newInc.region = fields.Region;
					newInc.acronym = fields.Acronym;
					newInc.corpllc = fields.corpllc;
					newInc.tags = fields['Good for'];
					newInc.companyCode = fields['Company code'];
					newInc.countryCode = fields['Country code'];
					newInc.legalEntity = fields['Legal entity'];
					newInc.reputation = fields['Reputation'];
					newInc.price = fields['Price'];
					newInc.package = fields['package'];
					newInc.shop = fields['shop']; */
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

					/* newTax.id = tax.data.id;
					newTax.country = fields.Country;
					newTax.patentBox = fields['Patent Box'];
					newTax.vat = fields['VAT Rate'];
					newTax.cfcRules = fields['CFC Rules'];
					newTax.companyCode = fields['Company code'];
					newTax.countryCode = fields['Country code'];
					newTax.propertyTax = fields['Property Tax'];
					newTax.transferTax = fields['Transfer tax'];
					newTax.wealthTax = fields['Wealth tax'];
					newTax.capitalDuties = fields['Capital duties'];
					newTax.totalCorporationTax = fields['Total Corporation Tax Burden'];
					newTax.totalTax = fields['Total Tax Rate'];
					newTax.taxTime = fields['Tax time (hours)'];
					newTax.legalEntityType = fields['Legal entity type'];
					newTax.corporateTax = fields['Corporate Tax Rate'];
					newTax.dividendsReceived = fields['Dividends Received'];
					newTax.taxPaymentsPerYear = fields['Tax payments per year'];
					newTax.capitalGainsTax = fields['Capital Gains Tax Rate'];
					newTax.estateInheritanceTax = fields['Estate inheritance tax'];
					newTax.lossesCarryback = fields['Losses carryback (years)'];
					newTax.losessCarryforward = fields['Losses carryforward (years)'];
					newTax.offshoreIncomeTax = fields['Offshore Income Tax Rate'];
					newTax.personalIncomeTax = fields['Personal Income Tax Rate'];
					newTax.socialSecurityEmployee = fields['Social Security Employee'];
					newTax.socialSecurityEmployer = fields['Social Security Employer'];
					newTax.thinCapitalisationRules = fields['Thin Capitalisation Rules'];
					newTax.taxIncentivesAndCredits = fields['Tax Incentives & Credits'];
					newTax.inventoryMethodsPermitted = fields['Inventory methods permitted'];
					newTax.offshoreIncomeTaxExemption = fields['Offshore Income Tax Exemption'];
					newTax.dividendsWitholdingTax = fields['Dividends Withholding Tax Rate'];
					newTax.interestsWitholdingTax = fields['Interests Withholding Tax Rate'];
					newTax.royaltiesWitholdingTax = fields['Royalties Withholding Tax Rate'];
					newTax.offshoreDividendsTaxExemption =
						fields['Offshore dividends tax exemption'];
					newTax.offshoreCapitalGainsTaxExemption =
						fields['Offshore capital gains tax exemption']; */

					return newTax;
				});
				resolve(payload);
			});
		});
	}

	loadTreatiesData(countryCode) {
		return new Promise((resolve, reject) => {
			log.info('Loading incorporations tax treaties API data');
			request.get(
				{ url: `${TREATIES_URL}/${countryCode}`, json: true },
				(error, httpResponse, response) => {
					if (error) {
						log.error(error);
						reject(error);
					}
					console.log(`${TREATIES_URL}/${countryCode}`);
					console.log(response);
					resolve(response);
				}
			);
		});
	}

	loadCountryInfo(countryCode) {
		return new Promise((resolve, reject) => {
			log.info('Loading incorporations country details API data');
			request.get(
				{ url: `${COUNTRY_INFO_URL}/${countryCode}`, json: true },
				(error, httpResponse, response) => {
					if (error) {
						log.error(error);
						reject(error);
					}
					console.log(`${COUNTRY_INFO_URL}/${countryCode}`);
					console.log(response);
					resolve(response);
				}
			);
		});
	}
}

export default IncorporationsService;
