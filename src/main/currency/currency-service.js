import config from 'common/config';
import request from 'request-promise-native';
import { Logger } from '../../common/logger';

const log = new Logger('CurrencyService');

const EXCHANGE_RATE_ENDPOINT = config.exchangeRateApiUrl;

export class CurrencyService {
	async fetchRates() {
		try {
			const fetched = await request.get({
				url: `${EXCHANGE_RATE_ENDPOINT}/latest?base=USD`,
				json: true
			});
			return fetched.rates ? fetched.rates : [];
		} catch (error) {
			log.error(error);
			return [];
		}
	}
}

export default CurrencyService;
