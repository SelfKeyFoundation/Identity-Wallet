import _ from 'lodash';
import { validate } from 'parameter-validator';
import { MoonPayApi } from './moonpay-api';
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

	checkServiceAvailability() {
		// check if service available based on ip
		// check if service available based on country of residency
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
