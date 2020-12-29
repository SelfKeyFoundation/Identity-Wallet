import _ from 'lodash';
import { validate } from 'parameter-validator';
import { MoonPayApi } from './moonpay-api';
import isoCountries from 'i18n-iso-countries';

export class MoonPayService {
	constructor({ config, walletService }) {
		this.config = config;
		this.walletService = walletService;
		this.endpoint = config.moonPayApiEndpoint;
		this.apiKey = config.moonPayApiKey;
	}

	async getSettings(walletId) {
		const settings = await this.walletService.getWalletSettings(walletId);
		return {
			agreedToTerms: settings.moonPayTermsAccepted,
			loginEmail: settings.moonPayLogin,
			authenticatedPreviously: settings.moonPayPreviousAuth
		};
	}

	async updateSettings(walletId, opts) {
		opts = _.pick(opts, ['loginEmail', 'agreedToTerms', 'authenticatedPreviously']);
		const settings = {};
		if (opts.loginEmail) {
			settings.moonPayLogin = opts.loginEmail;
		}
		if (opts.agreedToTerms) {
			settings.moonPayTermsAccepted = opts.agreedToTerms;
		}
		if (opts.authenticatedPreviously) {
			settings.moonPayPreviousAuth = opts.authenticatedPreviously;
		}
		if (!_.isEmpty(settings)) {
			await this.walletService.updateWalletSettings(walletId, settings);
		}
		return this.getSettings(walletId);
	}

	getApi(loginInfo = null) {
		return new MoonPayApi({
			endpoint: this.endpoint,
			apiKey: this.apiKey,
			loginInfo
		});
	}

	async checkServiceAvailability(countries = []) {
		countries = countries
			.map(c => c.data.value.country)
			.map(c => isoCountries.alpha2ToAlpha3(c));

		const api = this.getApi();

		const ipCheck = await api.getIpAddress();
		ipCheck.name = isoCountries.getName(ipCheck.alpha3, 'en', { select: 'official' });

		const remoteCountries = await api.listCountries();
		const customerCountries = countries.map(c => {
			const country = remoteCountries.find(rc => rc.alpha3 === c);

			if (country) {
				return country;
			}

			return {
				alpha2: isoCountries.alpha3ToAlpha2(c),
				alpha3: c,
				isBuyAllowed: false,
				isSellAllowed: false,
				isLightKycAllowed: false,
				name: isoCountries.getName(c, 'en', { select: 'official' }),
				supportedDocuments: [],
				isAllowed: false
			};
		});
		const allowedCountries = customerCountries.filter(c => c.isAllowed);

		const isServiceAllowed = allowedCountries.length > 0 || ipCheck.isAllowed;

		return {
			ipCheck,
			allowedCountries,
			customerCountries,
			isServiceAllowed
		};
	}

	async auth(identity, email) {
		validate({ identity, email }, ['identity', 'email']);
		const signer = async msg => {
			const signature = await identity.genSignatureForMessage(msg);
			return signature;
		};
		const authData = { email, walletAddress: identity.address };
		return this.getApi().establishSession(authData, signer);
	}

	getKycRequirements() {}

	checkKycStatus() {}

	async getLimits(auth) {
		return this.getApi(auth).getLimits();
	}

	verifyPhone() {}

	getQuote(opt) {}

	getCreditCards() {}

	addPaymentMethod() {}

	getTransaction(transactionId) {}
}

export default MoonPayService;
