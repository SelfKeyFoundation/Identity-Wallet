'use strict';
import config from 'common/config';
import { featureIsEnabled } from 'common/feature-flags';
import request from 'request';
import { Logger } from 'common/logger';

const log = new Logger('eth-gas-station-service');

// TODO: move URLs to config
const chainId = config.chainId || 11155111;
const URL = 'https://ethgasstation.info/json/ethgasAPI.json';
const EIP1559_URL =
	'https://gas-api.metaswap.codefi.network/networks/' + chainId + '/suggestedGasFees';

const eip1559Enabled = true;
export class EthGasStationService {
	getInfo() {
		return new Promise(async (resolve, reject) => {
			let fees = false;
			if (featureIsEnabled('eip_1559') || eip1559Enabled) {
				fees = await this.getFees();
				resolve({
					fees
				});
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
					const fallback = {
						low: {
							suggestedMaxPriorityFeePerGas: '1.16099754192',
							suggestedMaxFeePerGas: '77.871680564',
							minWaitTimeEstimate: 15000,
							maxWaitTimeEstimate: 30000
						},
						medium: {
							suggestedMaxPriorityFeePerGas: '1.5',
							suggestedMaxFeePerGas: '84.603239941',
							minWaitTimeEstimate: 15000,
							maxWaitTimeEstimate: 45000
						},
						high: {
							suggestedMaxPriorityFeePerGas: '2',
							suggestedMaxFeePerGas: '91.495796859',
							minWaitTimeEstimate: 15000,
							maxWaitTimeEstimate: 60000
						},
						estimatedBaseFee: '63.925569185'
					};
					resolve(fallback);
				} else {
					resolve(response);
				}
			});
		});
	}
}

export default EthGasStationService;
