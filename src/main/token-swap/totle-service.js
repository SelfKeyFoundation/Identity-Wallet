import config from 'common/config';
import request from 'request-promise-native';
import { Logger } from '../../common/logger';

const log = new Logger('TokenSwapTotleService');

const TOTLE_API_ENDPOINT = config.totleApiUrl;
const TOTLE_API_KEY = config.totleApiKey;

export class TotleSwapService {
	async fetchTokens() {
		try {
			let fetched = await request.get({ url: `${TOTLE_API_ENDPOINT}/tokens`, json: true });
			return fetched.tokens ? fetched.tokens : [];
		} catch (error) {
			log.error(error);
			return [];
		}
	}

	async swap(address, transaction, partnerContractAddress) {
		const payload = {
			apiKey: TOTLE_API_KEY,
			address,
			config: {
				transactions: true,
				fillNonce: true,
				skipBalanceChecks: config.dev
			},
			swap: {
				...transaction,
				isOptional: false,
				maxMarketSlippagePercent: 10,
				maxExecutionSlippagePercent: 3
			}
		};

		if (partnerContractAddress) {
			payload.partnerContract = partnerContractAddress;
		}

		log.debug(payload);

		try {
			const postRequest = await request.post({
				url: `${TOTLE_API_ENDPOINT}/swap`,
				body: payload,
				json: true
			});
			return postRequest;
		} catch (error) {
			log.error(error);
			return false;
		}
	}
}

export default TotleSwapService;
