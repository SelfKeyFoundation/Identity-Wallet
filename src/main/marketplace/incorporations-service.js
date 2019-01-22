'use strict';

import request from 'request';

import { Logger } from 'common/logger';

const log = new Logger('marketplace-incorporations-service');

// FIXME: hard coded URL
const URL = 'https://passports.io/api/incorporations';
const TREATIES_URL = 'https://passports.io/api/tax-treaties';

export class IncorporationsService {
	loadIncorporations() {
		return new Promise((resolve, reject) => {
			log.debug('Loading incorporations API data');
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
					Foundations
					// Trusts,
					// Guarantee
				} = response;
				const payload = {};

				payload.incorporations = Main.map(inc => {
					const newInc = {};
					const fields = inc.data.fields;
					newInc.id = inc.data.id;
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
					newInc.shop = fields['shop'];
					return newInc;
				});

				const corpMap = corp => {
					const newCorp = {};
					const fields = corp.data.fields;

					newCorp.id = corp.data.id;
					newCorp.aeoi = fields.AEOI;
					newCorp.region = fields.Region;
					newCorp.legalBasis = fields['Legal basis'];
					newCorp.companyCode = fields['Company code'];
					newCorp.countryCode = fields['Country code'];
					newCorp.annualReturn = fields['Annual return'];
					newCorp.legalFramework = fields['Legal framework'];
					newCorp.auditedAccounts = fields['Audited accounts'];
					newCorp.capitalCurrency = fields['Capital currency'];

					newCorp.regulatoryBody = fields['Regulatory body'];
					newCorp.registrationFee = fields['Registration fee'];
					newCorp.nameOfFoundation = fields['Name of foundation'];
					newCorp.descriptionOfFoundation = fields['Description of the Foundation'];
					newCorp.annualGovermentFee = fields['Annual goverment fee'];
					newCorp.minimumCouncilMembers = fields['Minimum council members'];

					newCorp.minimumMembers = fields['Minimum members'];
					newCorp.minimumManagers = fields['Minimum managers'];
					newCorp.minimumDirectors = fields['Minimum directors'];
					newCorp.minimumShareholders = fields['Mimimum shareholders'];

					newCorp.electronicSignature = fields['Electronic signatures'];

					newCorp.localDirectorRequired = fields['Local director required'];
					newCorp.localManagerRequired = fields['Local manger required'];
					newCorp.localPersonRequired = fields['Local regulated person required'];

					newCorp.minimumPaidUpCapital = fields['Minimum paid up capital'];
					newCorp.foreignOwnershipAllowed =
						fields['Foreign ownership allowed'] || fields['Foreign-ownership allowed'];
					newCorp.redomiciliationPermitted = fields['Redomiciliation permitted'];
					newCorp.auditedAccountsExemption = fields['Audited accounts exemption'];

					newCorp.corporateFounderPermitted = fields['Corporate founder permitted'];
					newCorp.corporateMembersPermitted = fields['Corporate members permitted'];
					newCorp.corporateManagersPermitted = fields['Corporate managers permitted'];
					newCorp.corporateDirectorsPermitted = fields['Corporate directors permitted'];
					newCorp.corporateShareholdersPermitted =
						fields['Corporate shareholders permitted'];
					newCorp.corporateCouncilMembersPermitted =
						fields['Corporate council members permitted'];

					newCorp.annualGeneralMeetingRequired =
						fields['Annual general meetings required'];
					newCorp.locationOfAnnualGeneralMeeting =
						fields['Location of annual general meeting'];
					newCorp.registeredOfficeOrAgentRequired =
						fields['Registered office or agent required'] ||
						fields['Registered agent required'];
					newCorp.field36 = fields['Field 36'];

					newCorp.managerNotDisclosed =
						fields['Manager not disclosed in a public registry'];
					newCorp.membersNotDisclosed =
						fields['Members not disclosed in a public registry'];
					newCorp.directorsNotDisclosed =
						fields['Directors not disclosed in a public registry'];
					newCorp.shareholdersNotDisclosed =
						fields['Shareholders not disclosed in a public registry'];
					newCorp.beneficiariesNotDisclosed =
						fields['Beneficiaries not disclosed in a public registry'];
					newCorp.protectorNotDisclosed =
						fields['Protector/Guardian not disclosed in a public registry'];

					newCorp.minimumCapitalization = fields['Min_capitalization_'];
					newCorp.companyRegisterUrl = fields['Company_Register_URL'];
					newCorp.companyRegisterName = fields['Company_Register_Name'];
					newCorp.registeredAgentList = fields['Registered_Agent_List'];
					newCorp.minimumIssuedCapital = fields['Minimum issued capital'];
					newCorp.onlineRegistry = fields['Online_Registry\n'];
					newCorp.secreteryRequired = fields['Secretary required'];
					newCorp.taxTransparentEntity = fields['Tax transparent entity'];

					newCorp.initialAssetsEndowent = fields['Initial endowment of assets'];
					newCorp.charitablePurposesPermitted = fields['Charitable purposes permitted'];
					newCorp.beneficiariesHaveInformationRights =
						fields['Beneficiaries have right to information'];
					newCorp.meaningOfSecurities = fields['meaning of secutiries'];
					newCorp.protectorRequired = fields['Protector/Guardian required'];
					return newCorp;
				};

				payload.corporations = Corporations.map(corpMap);
				payload.llcs = LLCs.map(corpMap);
				payload.foundations = Foundations.map(corpMap);

				payload.taxes = Taxes.map(tax => {
					const newTax = {};
					const fields = tax.data.fields;

					newTax.id = tax.data.id;
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
						fields['Offshore capital gains tax exemption'];

					return newTax;
				});
				resolve(payload);
			});
		});
	}

	loadTreatiesData(countryCode) {
		return new Promise((resolve, reject) => {
			log.debug('Loading incorporations tax-treaties API data');
			request.get(
				{ url: `${TREATIES_URL}/${countryCode}`, json: true },
				(error, httpResponse, response) => {
					if (error) {
						log.error(error);
						reject(error);
					}
					resolve(response);
				}
			);
		});
	}
}

export default IncorporationsService;
