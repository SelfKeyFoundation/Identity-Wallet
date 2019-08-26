'use strict';

import request from 'request';
import AsyncTaskQueue from 'common/utils/async-task-queue';
import BigNumber from 'bignumber.js';

import { Logger } from 'common/logger';
import config from 'common/config';
import Wallet from '../wallet/wallet';
import WalletSetting from '../wallet/wallet-setting';
import TxHistory from './tx-history';

const log = new Logger('tx-history-service');

export const REQUEST_INTERVAL_DELAY = 600; // millis
export const ETH_BALANCE_DIVIDER = new BigNumber(10 ** 18);
export const ENDPOINT_CONFIG = {
	1: { url: 'https://api.etherscan.io/api' },
	3: { url: 'http://api-ropsten.etherscan.io/api' }
};
export const API_ENDPOINT = ENDPOINT_CONFIG[config.chainId].url;

export const TX_HISTORY_ENDPOINT_CONFIG = {
	1: { url: 'https://etherscan.io/tx' },
	3: { url: 'https://ropsten.etherscan.io/tx' }
};
export const TX_HISTORY_API_ENDPOINT = TX_HISTORY_ENDPOINT_CONFIG[config.chainId].url;

export let OFFSET = 1000;

export const TX_LIST_ACTION = `?module=account&action=txlist&sort=desc&offset=${OFFSET}`;
export const TOKEN_TX_ACTION = `?module=account&action=tokentx&sort=desc&offset=${OFFSET}`;
export const TX_RECEIPT_ACTION = '?module=proxy&action=eth_getTransactionReceipt';

// in order to change key name in runtime
export const KEY_MAP = {
	txreceipt_status: 'txReceiptStatus'
};

export const KNOWN_KEYS = [
	'blockNumber',
	'timeStamp',
	'hash',
	'nonce',
	'blockHash',
	'transactionIndex',
	'from',
	'to',
	'value',
	'gas',
	'gasPrice',
	'isError',
	'txreceipt_status',
	'input',
	'contractAddress',
	'cumulativeGasUsed',
	'gasUsed',
	'confirmations',
	'tokenName',
	'tokenSymbol',
	'tokenDecimal'
];

export const KEY_TYPES_MAP = {
	blockNumber: 'integer',
	value: 'integer',
	transactionIndex: 'integer',
	gas: 'integer',
	gasPrice: 'integer',
	cumulativeGasUsed: 'integer',
	gasUsed: 'integer',
	confirmations: 'integer',
	isError: 'integer',
	txReceiptStatus: 'integer',
	tokenDecimal: 'integer'
};

export class TxHistoryService {
	static isSyncingMap = {};
	static syncingJobIsStarted = false;

	static isSyncing(address) {
		if (!address) {
			return false;
		}
		return this.isSyncingMap[address];
	}
	constructor({ web3Service }) {
		this.web3Service = web3Service;
		this.queue = new AsyncTaskQueue(this.handleTask.bind(this), REQUEST_INTERVAL_DELAY);
	}
	handleTask(args) {
		return this.makeRequest(args.method, args.url, args.data || null);
	}
	loadEthTxHistory(address, startblock, endblock, page) {
		const ACTION_URL = `${API_ENDPOINT}${TX_LIST_ACTION}&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}`;
		return this.queue.push({ method: 'get', url: ACTION_URL });
	}
	loadERCTxHistory(address, startblock, endblock, page) {
		const ACTION_URL = `${API_ENDPOINT}${TOKEN_TX_ACTION}&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}`;
		return this.queue.push({ method: 'get', url: ACTION_URL });
	}
	getTransactionReceipt(txhash) {
		const ACTION_URL = API_ENDPOINT + TX_RECEIPT_ACTION + '&txhash=' + txhash;
		return this.queue.push({ method: 'get', url: ACTION_URL });
	}
	getMostResentBlock() {
		const ACTION_URL = API_ENDPOINT + '?module=proxy&action=eth_blockNumber';
		return this.queue.push({ method: 'get', url: ACTION_URL });
	}
	makeRequest(method, url, data) {
		return new Promise((resolve, reject) => {
			request[method](url, (error, httpResponse, response) => {
				if (error) {
					log.error(error);
					return reject(error);
				}
				try {
					response = JSON.parse(response);
					resolve(response.result);
				} catch (error) {
					reject(error);
				}
			});
		});
	}
	async getContractInfo(contractAddress) {
		try {
			let tokenDecimal = await this.web3Service.waitForTicket({
				method: 'call',
				args: [],
				contractAddress,
				contractMethod: 'decimals'
			});
			let tokenSymbol = await this.web3Service.waitForTicket({
				method: 'call',
				args: [],
				contractAddress,
				contractMethod: 'symbol'
			});

			let tokenName = await this.web3Service.waitForTicket({
				method: 'call',
				contractAddress,
				contractMethod: 'name'
			});
			return {
				tokenDecimal: Number.isInteger(tokenDecimal)
					? tokenDecimal
					: tokenDecimal && typeof tokenDecimal === 'object'
					? tokenDecimal.toNumber()
					: tokenDecimal,
				tokenSymbol,
				tokenName
			};
		} catch (err) {
			log.error('IS NOT CONTRACT ADDRESS, %s, %s', contractAddress, err);
			return null;
		}
	}
	async processTx(txs, walletAddress) {
		let processedTx = {
			networkId: config.chainId,
			createdAt: new Date().getTime()
		};
		let propperTx = txs.token ? txs.token : txs.eth;

		// means it's not NORMAL transaction
		if (!propperTx.from || !propperTx.to) {
			return null;
		}

		KNOWN_KEYS.forEach(key => {
			let processedKey = KEY_MAP[key] ? KEY_MAP[key] : key;
			processedTx[processedKey] = propperTx[key];
		});

		let balanceValueDivider;
		if (txs.token) {
			processedTx.txReceiptStatus = txs.eth ? txs.eth.txReceiptStatus : null;

			if (!this.hasContractInfo(processedTx)) {
				let contractInfo = await this.getContractInfo(processedTx.contractAddress);
				if (!contractInfo) {
					return null;
				}

				Object.assign(processedTx, contractInfo);
			}

			balanceValueDivider = new BigNumber(10 ** processedTx.tokenDecimal);
		}

		balanceValueDivider = balanceValueDivider || ETH_BALANCE_DIVIDER;

		// toString is important! in order to avoid exponential
		processedTx.value = new BigNumber(processedTx.value).div(balanceValueDivider).toString(10);
		processedTx.tokenSymbol = processedTx.tokenSymbol
			? processedTx.tokenSymbol.toUpperCase()
			: null;

		processedTx.timeStamp = +(processedTx.timeStamp + '000');
		processedTx.from = processedTx.from.toLowerCase();
		processedTx.to = processedTx.to.toLowerCase();
		let status = processedTx.txReceiptStatus;
		processedTx.txReceiptStatus = !isNaN(parseInt(status))
			? status
			: await this.getTxReceiptStatus(processedTx.hash);

		if (this.isFailedERC20TokenTx(txs)) {
			// set faild status, there is some exeptions, so that's needed
			processedTx.txReceiptStatus = 0;
			processedTx.from === walletAddress
				? (processedTx.contractAddress = processedTx.to)
				: (processedTx.contractAddress = processedTx.from);
			try {
				let contractInfo = await this.getContractInfo(processedTx.contractAddress);
				if (!contractInfo) {
					return null;
				}
				Object.assign(processedTx, contractInfo);
			} catch (error) {
				console.error(error);
				return null;
			}
		}

		processedTx.contractAddress = processedTx.contractAddress || null; // iportant for find by eth

		return processedTx;
	}
	hasContractInfo(tokenTx) {
		return tokenTx.tokenDecimal && tokenTx.tokenSymbol && tokenTx.tokenName;
	}

	isFailedERC20TokenTx(txs) {
		return !txs.token && +txs.eth.value === 0;
	}

	async getTxReceiptStatus(hash) {
		let txReceipt = await this.getTransactionReceipt(hash);
		if (txReceipt && txReceipt.status) {
			return parseInt(txReceipt.status, 16);
		}
		return 0; // failed
	}
	async processTxHistory(txHashes, walletAddress) {
		let hashes = Object.keys(txHashes);
		for (let hash of hashes) {
			let txs = txHashes[hash];
			let processedTx = await this.processTx(txs, walletAddress);
			if (processedTx) {
				Object.keys(processedTx).forEach(key => {
					let val = processedTx[key];
					if (typeof val === 'string' && KEY_TYPES_MAP[key] === 'integer') {
						processedTx[key] = +val;
					}
				});

				await TxHistory.addOrUpdate(processedTx);
			}
		}
	}
	getWalletSetting(walletId) {
		return WalletSetting.findByWalletId(walletId);
	}
	async syncByWallet(address, walletId, showProgress, reload = false) {
		let self = this.constructor;
		if (showProgress) {
			self.isSyncingMap[address] = true;
		}
		let endblock = await this.getMostResentBlock();
		endblock = parseInt(endblock, 16);
		let walletSetting = await this.getWalletSetting(walletId);
		let startBlock = reload ? 0 : walletSetting.txHistoryLastSyncedBlock || 0;
		let page = 1;
		let txHashes = {};
		return new Promise((resolve, reject) => {
			let that = this;
			(async function next(hasNext) {
				if (!hasNext) {
					await that.processTxHistory(txHashes, address);

					if (showProgress) {
						self.isSyncingMap[address] = false;
					}

					walletSetting = await that.getWalletSetting(walletId);
					walletSetting.txHistoryLastSyncedBlock = endblock;
					await WalletSetting.updateById(walletSetting.id, walletSetting);

					return resolve();
				}
				let ethTxList = await that.loadEthTxHistory(address, startBlock, endblock, page);
				let tokenTxList = await that.loadERCTxHistory(address, startBlock, endblock, page);

				ethTxList.concat(tokenTxList).forEach((tx, index) => {
					let hash = tx.hash;
					txHashes[hash] = txHashes[hash] || {};
					let isToken = index >= ethTxList.length;
					txHashes[hash][isToken ? 'token' : 'eth'] = tx;
				});

				page++;
				next(ethTxList.length === OFFSET || tokenTxList.length === OFFSET);
			})(true);
		});
	}
	async sync() {
		let wallets = await Wallet.findAll();
		for (let wallet of wallets) {
			let address = wallet.address.toLowerCase();
			address = address.startsWith('0x') ? address : `0x${address}`;
			await this.syncByWallet(address, wallet.id);
			await this.removeNotMinedPendingTxs(address);
		}
	}
	async removeNotMinedPendingTxs(address) {
		return TxHistory.updatePendingTxsByPublicKey(address);
	}

	startSyncingJob() {
		let self = this.constructor;
		if (self.syncingJobIsStarted) {
			log.error('Transaction Syncing Job Is already Started!');
			return;
		}

		self.syncingJobIsStarted = true;
		let that = this;
		(async function next() {
			await that.sync();
			next();
		})();
	}

	async getTransactions(address) {
		return TxHistory.findByPublicKey(address);
	}

	async reload(wallet) {
		let address = wallet.address.toLowerCase();
		address = address.startsWith('0x') ? address : `0x${address}`;
		await this.syncByWallet(address, wallet.id, true, true);
		await this.removeNotMinedPendingTxs(address);
	}
}

export default TxHistoryService;
