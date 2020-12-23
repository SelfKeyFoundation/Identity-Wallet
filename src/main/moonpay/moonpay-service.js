import { validate } from 'parameter-validator';
import { MoonPayApi } from './moonpay-api';
export class MoonPayService {
	constructor({ config }) {
		this.config = config;
		this.endpoint = config.moonPayApiEndpoint;
		this.apiKey = config.moonPayApiKey;
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
