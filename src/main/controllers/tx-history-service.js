'use strict';
const { Logger } = require('common/logger');
const log = new Logger('tx-history-service');
const Promise = require('bluebird');
const electron = require('electron');
const config = require('../config');
const request = require('request');
const async = require('async');
const BigNumber = require('bignumber.js');

const Wallet = require('../models/wallet');
const WalletSetting = require('../models/wallet-setting');
const TxHistory = require('../models/tx-history');

let isSyncingMap = {};
let syncingJobIsStarted = false;

let getIsSyncing = address => {
	if (!address) {
		return false;
	}

	return isSyncingMap[address];
};

let defaultModule = function(app) {
	const REQUEST_INTERVAL_DELAY = 600; // millis
	const ETH_BALANCE_DIVIDER = new BigNumber(10 ** 18);
	const ENDPOINT_CONFIG = {
		1: { url: 'https://api.etherscan.io/api' },
		3: { url: 'http://api-ropsten.etherscan.io/api' }
	};
	const API_ENDPOINT = ENDPOINT_CONFIG[config.chainId].url;

	let OFFSET = 1000;

	const TX_LIST_ACTION = `?module=account&action=txlist&sort=desc&offset=${OFFSET}`;
	const TOKEN_TX_ACTION = `?module=account&action=tokentx&sort=desc&offset=${OFFSET}`;
	const TX_RECEIPT_ACTION = '?module=proxy&action=eth_getTransactionReceipt';

	// in order to change key name in runtime
	const KEY_MAP = {
		txreceipt_status: 'txReceiptStatus'
	};

	const KNOWN_KEYS = [
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

	const KEY_TYPES_MAP = {
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

	let queue = async.queue((args, callback) => {
		let result = makeRequest.apply(this, [args.method, args.url, args.data]);
		setTimeout(() => {
			callback(result);
		}, REQUEST_INTERVAL_DELAY);
	}, 1);

	function loadEthTxHistory(address, startblock, endblock, page) {
		return new Promise((resolve, reject) => {
			const ACTION_URL = `${API_ENDPOINT}${TX_LIST_ACTION}&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}`;
			queue.push({ method: 'get', url: ACTION_URL }, promise => {
				resolve(promise);
			});
		});
	}

	async function loadERCTxHistory(address, startblock, endblock, page) {
		return new Promise((resolve, reject) => {
			const ACTION_URL = `${API_ENDPOINT}${TOKEN_TX_ACTION}&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}`;
			queue.push({ method: 'get', url: ACTION_URL }, promise => {
				resolve(promise);
			});
		});
	}

	function getTransactionReceipt(txhash) {
		return new Promise((resolve, reject) => {
			const ACTION_URL = API_ENDPOINT + TX_RECEIPT_ACTION + '&txhash=' + txhash;
			queue.push({ method: 'get', url: ACTION_URL }, promise => {
				resolve(promise);
			});
		});
	}

	function getMostResentBlock() {
		return new Promise((resolve, reject) => {
			const ACTION_URL = API_ENDPOINT + '?module=proxy&action=eth_blockNumber';
			queue.push({ method: 'get', url: ACTION_URL }, promise => {
				resolve(promise);
			});
		});
	}

	function makeRequest(method, url, data) {
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

	async function getContractInfo(contractAddress) {
		const Web3Service = electron.app.web3Service;

		try {
			let tokenDecimal = await Web3Service.waitForTicket({
				method: 'call',
				args: [],
				contractAddress,
				contractMethod: 'decimals'
			});
			let tokenSymbol = await Web3Service.waitForTicket({
				method: 'call',
				args: [],
				contractAddress,
				contractMethod: 'symbol'
			});
			let tokenName = await Web3Service.waitForTicket({
				method: 'call',
				contractAddress,
				contractMethod: 'name'
			});
			return { tokenDecimal, tokenSymbol, tokenName };
		} catch (err) {
			log.error('IS NOT CONTRACT ADDRESS, %s', err);
			return null;
		}
	}

	/**
	 *
	 * @param {*} txs
	 * @param {*} walletAddress
	 */
	async function getProcessedTx(txs, walletAddress) {
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

			if (!_hasContractInfo(processedTx)) {
				let contractInfo = await getContractInfo(processedTx.contractAddress);
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
			: await _getTxReceiptStatus(processedTx.hash);

		if (_isFailedERC20TokenTx(txs)) {
			// set faild status, there is some exeptions, so that's needed
			processedTx.txReceiptStatus = 0;

			processedTx.from === walletAddress
				? (processedTx.contractAddress = processedTx.to)
				: (processedTx.contractAddress = processedTx.from);

			let contractInfo = await getContractInfo(processedTx.contractAddress);
			if (!contractInfo) {
				return null;
			}

			Object.assign(processedTx, contractInfo);
		}

		processedTx.contractAddress = processedTx.contractAddress || null; // iportant for find by eth

		return processedTx;
	}

	function _hasContractInfo(tokenTx) {
		return tokenTx.tokenDecimal && tokenTx.tokenSymbol && tokenTx.tokenName;
	}

	function _isFailedERC20TokenTx(txs) {
		return !txs.token && +txs.eth.value === 0;
	}

	async function _getTxReceiptStatus(hash) {
		let txReceipt = await getTransactionReceipt(hash);
		if (txReceipt && txReceipt.status) {
			return parseInt(txReceipt.status, 16);
		}
		return 0; // failed
	}

	async function processTxHistory(txHashes, walletAddress) {
		let hashes = Object.keys(txHashes);
		for (let hash of hashes) {
			let txs = txHashes[hash];
			let processedTx = await getProcessedTx(txs, walletAddress);
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

	const controller = function() {};

	async function _getWalletSetting(walletId) {
		return WalletSetting.findByWalletId(walletId);
	}

	async function _syncByWallet(address, walletId, showProgress) {
		if (showProgress) {
			isSyncingMap[address] = true;
		}
		let endblock = await getMostResentBlock();
		endblock = parseInt(endblock, 16);
		let walletSetting = await _getWalletSetting(walletId);
		let startBlock = walletSetting.txHistoryLastSyncedBlock || 0;
		let page = 1;
		let txHashes = {};
		return new Promise((resolve, reject) => {
			(async function next(hasNext) {
				if (!hasNext) {
					await processTxHistory(txHashes, address);
					if (showProgress) {
						isSyncingMap[address] = false;
					}

					walletSetting = await _getWalletSetting(walletId);
					walletSetting.txHistoryLastSyncedBlock = endblock;
					await WalletSetting.updateById(walletSetting.id, walletSetting);

					return resolve();
				}
				let ethTxList = await loadEthTxHistory(address, startBlock, endblock, page);
				let tokenTxList = await loadERCTxHistory(address, startBlock, endblock, page);

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

	async function sync() {
		let wallets = await Wallet.findAll();
		for (let wallet of wallets) {
			let address = ('0x' + wallet.publicKey).toLowerCase();
			await _syncByWallet(address, wallet.id);
			await removeNotMinedPendingTxs(address);
		}
	}

	async function removeNotMinedPendingTxs(address) {
		let nonce = await electron.app.web3Service.waitForTicket({
			method: 'getTransactionCount',
			args: [address, 'pending']
		});

		TxHistory.removeNotMinedPendingTxsByPublicKey(address, +nonce);
	}

	function _startSyncingJob() {
		if (syncingJobIsStarted) {
			log.error('Transaction Syncing Job Is already Started!');
			return;
		}

		syncingJobIsStarted = true;
		(async function next() {
			await sync();
			next();
		})();
	}

	controller.prototype.startSyncingJob = _startSyncingJob;
	controller.prototype.syncByWallet = _syncByWallet;

	return controller;
};

module.exports = {
	default: defaultModule,
	isSyncing: getIsSyncing
};
