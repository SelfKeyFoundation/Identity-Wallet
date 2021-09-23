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
		return new Promise(async (resolve, reject) => {
			let fees = false;
			if (featureIsEnabled('eip_1559')) {
				fees = await this.getFees();
			}

			request.get({ url: URL, json: true }, (error, httpResponse, response) => {
				if (error) {
					log.error(error);
					reject(error);
				}
				if (featureIsEnabled('eip_1559')) {
					response.fees = fees;
				}
				resolve(response);
			});
		});
	}

	getFees() {
		return new Promise((resolve, reject) => {
			request.get({ url: EIP1559_URL, json: true }, (error, httpResponse, response) => {
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
