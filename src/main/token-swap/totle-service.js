import config from 'common/config';
import request from 'request-promise-native';
// import urljoin from 'url-join';
// import _ from 'lodash';
import { Logger } from '../../common/logger';

const log = new Logger('TokenSwapTotleService');

export const TOTLE_API_ENDPOINT = config.totleApiUrl;

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
}

export default TotleSwapService;
