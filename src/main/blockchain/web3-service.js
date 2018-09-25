'use strict';
import Web3 from 'web3';
import EtheriumTx from 'ethereumjs-tx';
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
	constructor(ctx = {}) {
		this.web3 = new Web3();
		this.store = ctx.store;
		const { HttpProvider } = this.web3.providers;
		this.web3.setProvider(new HttpProvider(SELECTED_SERVER_URL));
		this.q = new AsyncTaskQueue(this.handleTicket.bind(this), REQUEST_INTERVAL_DELAY);
		this.nonce = 0;
	}
	async handleTicket(data) {
		log.debug('handle ticket %2j', data);
		const {
			contractAddress,
			contractMethod,
			method,
			customWeb3,
			customAbi,
			contractMethodArgs = [],
			wallet = null,
			args = []
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
		if (method === 'send') {
			return {
				...(await this.sendSignedTransaction(contract, contractAddress, args, wallet))
			};
		}
		return { ticketPromise: contract[method](...args) };
	}
	getSelectedServerURL() {
		return SELECTED_SERVER_URL;
	}
	waitForTicket(args) {
		return new Promise(async (resolve, reject) => {
			try {
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
			} catch (error) {
				reject(error);
			}
		});
	}
	async sendSignedTransaction(contactMethodInstance, contractAdress, args, wallet) {
		let opts = { ...(args || [])[0] };
		if (!opts.from) {
			throw new Error('src address is not defined');
		}
		if (!wallet) {
			wallet = this.store.getState().wallet;
		}
		if (!wallet || '0x' + wallet.publicKey !== opts.from) {
			throw new Error('provided wallet does not contain requested address');
		}
		if (wallet.profile !== 'local') {
			return contactMethodInstance.send(...args);
		}
		if (!wallet.privateKey) {
			throw new Error('the wallet provided is not unlocked');
		}

		if (!opts.gasPrice) {
			opts.gasPrice = await this.web3.eth.getGasPrice();
		}
		opts.gasPrice = this.web3.utils.toHex(opts.gasPrice);
		if (!opts.gas) {
			opts.gas = await contactMethodInstance.estimateGas({
				from: opts.from,
				value: this.web3.utils.toHex(0)
			});
		}

		let data = contactMethodInstance.encodeABI();
		let nonce = await this.web3.eth.getTransactionCount(opts.from, 'pending');
		if (nonce === this.nonce) {
			nonce++;
		}
		let rawTx = {
			nonce: this.web3.utils.toHex(nonce),
			to: contractAdress,
			value: this.web3.utils.toHex(0),
			data,
			chainId: CONFIG.chainId,
			...opts
		};
		const tx = new EtheriumTx(rawTx);
		tx.sign(wallet.privateKey);
		let serializedTx = '0x' + tx.serialize().toString('hex');
		this.nonce = nonce;
		return {
			ticketPromise: this.web3.eth.sendSignedTransaction(serializedTx).catch(error => {
				this.nonce = 0;
				return error;
			})
		};
	}
}

export default Web3Service;
