'use strict';

import request from 'request';
import { Logger } from 'common/logger';
import config from 'common/config';

const log = new Logger('marketplace-bank-accounts-service');

const URL = config.bankAccountsApiUrl;

export class BankAccountsService {
	loadBankAccounts() {
		return new Promise((resolve, reject) => {
			log.info(`Loading bank accounts main API data: ${URL}`);
			request.get({ url: URL, json: true }, (error, httpResponse, response) => {
				if (error) {
					log.error(error);
					return reject(error);
				}
				const payload = {};

				const fieldMap = corp => {
					const fields = corp.data.fields;
					const newCorp = { ...fields, id: corp.data.id };

					return newCorp;
				};

				const transformMachineReadable = (obj, key, machineKey) => {
					obj[machineKey] = obj[machineKey] ? obj[machineKey] : obj[key];
					return obj;
				};

				payload.main = response.Main.map(fieldMap);
				payload.main.map(bank => {
					// Transform into Machine readable fields
					bank.type = bank['Type of Account']
						? bank['Type of Account'][0].toLowerCase()
						: undefined;

					bank = transformMachineReadable(bank, 'Region', 'region');
					bank = transformMachineReadable(bank, 'Country Code', 'countryCode');
					bank = transformMachineReadable(bank, 'Eligibility', 'eligibility');
					bank = transformMachineReadable(bank, 'Min Deposit', 'minDeposit');
					bank = transformMachineReadable(bank, 'Good For', 'goodFor');
					bank = transformMachineReadable(bank, 'Bank Code', 'bankCode');
					return bank;
				});
				payload.jurisdictions = response.Jurisdictions.map(fieldMap);
				payload.details = response.Account_Details.map(fieldMap);

				resolve(payload);
			});
		});
	}
}

export default BankAccountsService;
