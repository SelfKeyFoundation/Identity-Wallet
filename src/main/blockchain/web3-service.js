'use strict';
import Web3 from 'web3';
import AsyncTaskQueue from 'common/utils/async-task-queue';
import CONFIG from 'common/config';
import { abi as ABI } from 'main/assets/data/abi.json';
import { Logger } from 'common/logger';

const log = new Logger('Web3Service');

export const REQUEST_INTERVAL_DELAY = 500;

export const SERVER_CONFIG = {
	mew: {
		1: { url: 'https://api.myetherapi.com/eth' },
		3: { url: 'https://api.myetherapi.com/rop' }
	},
	infura: {
		1: { url: 'https://mainnet.infura.io' },
		3: { url: 'https://ropsten.infura.io' }
	}
};

export const SELECTED_SERVER_URL = SERVER_CONFIG[CONFIG.node][CONFIG.chainId].url;

export class Web3Service {
	constructor() {
		this.web3 = new Web3();
		const { HttpProvider } = this.web3.providers;
		this.web3.setProvider(new HttpProvider(SELECTED_SERVER_URL));
		this.q = new AsyncTaskQueue(this.handleTicket.bind(this), REQUEST_INTERVAL_DELAY);
	}
	handleTicket(data) {
		log.debug('handle ticket %2j', data);
		const {
			contractAddress,
			contractMethod,
			method,
			customWeb3,
			customAbi,
			contractMethodArgs = [],
			args
		} = data;
		const { Contract } = this.web3.eth;
		const web3 = customWeb3 || this.web3;
		let contract = web3.eth;

		if (contractAddress) {
			contract = new Contract(customAbi || ABI, contractAddress);
			if (contractMethod) {
				contract = contract.methods[contractMethod](...contractMethodArgs);
			}
		}
		return { ticketPromise: contract[method](...args) };
	}
	getSelectedServerURL() {
		return SELECTED_SERVER_URL;
	}
	async waitForTicket(args) {
		return new Promise(async (resolve, reject) => {
			let res = await this.q.push(args);
			let ticketPromise = res.ticketPromise;

			if (!ticketPromise) {
				return reject(new Error('Failed to process ticket'));
			}

			ticketPromise.catch(err => {
				reject(err);
			});

			if (args.onceListenerName) {
				ticketPromise.once(args.onceListenerName, res => {
					resolve(res);
				});
			} else {
				ticketPromise.then(res => {
					resolve(res);
				});
			}
		});
	}
}

export default Web3Service;
