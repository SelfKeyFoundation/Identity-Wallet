'use strict';
import config from 'common/config';
import { featureIsEnabled } from 'common/feature-flags';
import request from 'request';
import { Logger } from 'common/logger';

const log = new Logger('eth-gas-station-service');

// TODO: move URLs to config
const chainId = config.chainId || 3;
const URL = 'https://ethgasstation.info/json/ethgasAPI.json';
const EIP1559_URL =
	'https://gas-api.metaswap.codefi.network/networks/' + chainId + '/suggestedGasFees';

export class EthGasStationService {
	getInfo() {
		const url = featureIsEnabled('eip_1559') ? EIP1559_URL : URL;
		return new Promise((resolve, reject) => {
			request.get({ url, json: true }, (error, httpResponse, response) => {
				if (error) {
					log.error(error);
					reject(error);
				}
				resolve(response);
			});
		});
	}
}

export default EthGasStationService;
