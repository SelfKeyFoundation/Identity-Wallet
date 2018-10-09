'use strict';

import request from 'request';

import { Logger } from 'common/logger';

const log = new Logger('eth-gas-station-service');

const URL = 'https://ethgasstation.info/json/ethgasAPI.json';

export class EthGasStationService {
	getInfo() {
		return new Promise((resolve, reject) => {
			request.get({ url: URL, json: true }, (error, httpResponse, response) => {
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
