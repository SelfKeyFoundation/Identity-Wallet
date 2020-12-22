import { MoonPayApi } from './moonpay-api';
export class MoonPayService {
	constructor({ config }) {
		this.api = new MoonPayApi({
			endpoint: config.moonPayEndpoint,
			apiKey: config.moonPayApiKey
		});
	}

	checkServiceAvailability() {
		// check if service available based on ip/residency attributes
	}
}

export default MoonPayService;
