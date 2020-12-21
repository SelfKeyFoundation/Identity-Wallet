import { MoonPayApi } from './moonpay-api';
export class MoonPayService {
	constructor({ config }) {
		this.api = new MoonPayApi({
			endpoint: config.moonPayEndpoint,
			apiKey: config.moonPayApiKey
		});
	}

	checkServiceAvailability() {
		// check if service available based on ip
		// check if service available based on country of residency
	}

	auth(identity) {
		// authenticate with moonpay
	}

	getKycRequirements() {}

	checkKycStatus() {}

	getLimits() {}

	verifyPhone() {}

	getQuote(opt) {}

	listCreditCards() {}

	addPaymentMethod() {}

	getTransaction(transactionId) {}
}

export default MoonPayService;
