'use strict';

const Promise = require('bluebird'),
	electron = require('electron'),
	path = require('path'),
	config = require('../config'),
	request = require('request'),
	async = require('async'),
	BigNumber = require('bignumber.js');

let isSyncingMap = {};
let syncingJobIsStarted = false;

let getIsSyncing = address => {
	if (!address) {
		return false;
	}

	return isSyncingMap[address];
};

let defaultModule = function(app) {
	const API_KEY = null;
	const REQUEST_INTERVAL_DELAY = 600; // millis
	const ETH_BALANCE_DIVIDER = new BigNumber(10 ** 18);
	const ENDPOINT_CONFIG = {
		1: { url: 'https://api.etherscan.io/api' },
		3: { url: 'http://api-ropsten.etherscan.io/api' }
	};
	const API_ENDPOINT = ENDPOINT_CONFIG[config.chainId].url;

	let OFFSET = 1000;

	const TX_LIST_ACTION = `?module=account&action=txlist&startblock=0&sort=asc&offset=${OFFSET}`;
	const TOKEN_TX_ACTION = `?module=account&action=tokentx&startblock=0&sort=asc&offset=${OFFSET}`;
	const TX_RECEIPT_ACTION = '?module=proxy&action=eth_getTransactionReceipt';

	//in order to change key name in runtime
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
			console.log('IS NOT CONTRACT ADDRESS');
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

		let balanceValueDivider, propperTx;
		if (txs.token) {
			balanceValueDivider = new BigNumber(10 ** txs.token.tokenDecimal);
			propperTx = txs.token;
			propperTx.txreceipt_status = txs.eth ? txs.eth.txreceipt_status : null;
		} else {
			balanceValueDivider = ETH_BALANCE_DIVIDER;
			propperTx = txs.eth;
		}

		KNOWN_KEYS.forEach(key => {
			let processedKey = KEY_MAP[key] ? KEY_MAP[key] : key;
			processedTx[processedKey] = propperTx[key];
		});

		//toString is important! in order to avoid exponential
		processedTx.value = new BigNumber(processedTx.value).div(balanceValueDivider).toString(10);
		processedTx.tokenSymbol = processedTx.tokenSymbol
			? processedTx.tokenSymbol.toUpperCase()
			: null;
		processedTx.timeStamp = +(processedTx.timeStamp + '000');

		processedTx.from = processedTx.from ? processedTx.from.toLowerCase() : null;
		processedTx.to = processedTx.to ? processedTx.to.toLowerCase() : null;

		processedTx.contractAddress = processedTx.contractAddress || null; // iportant for find by eth
		if (processedTx.txReceiptStatus == null) {
			let txReceipt = await getTransactionReceipt(processedTx.hash);
			if (txReceipt && txReceipt.status) {
				processedTx.txReceiptStatus = parseInt(txReceipt.status, 16);
			}
		}

		//faild transaction
		if (processedTx.value == 0) {
			//set faild status, there is some exeptions, so that's needed
			processedTx.txReceiptStatus = 0;

			processedTx.from == walletAddress
				? (processedTx.contractAddress = processedTx.to)
				: (processedTx.contractAddress = processedTx.from);

			let contractInfo = await getContractInfo(processedTx.contractAddress);
			if (!contractInfo) {
				return null;
			}

			Object.assign(processedTx, contractInfo);
		}

		return processedTx;
	}

	async function processTxHistory(txHashes, walletAddress) {
		let processedHashes = {};

		let hashes = Object.keys(txHashes);
		for (let hash of hashes) {
			let txs = txHashes[hash];
			let processedTx = await getProcessedTx(txs, walletAddress);
			if (processedTx) {
				await electron.app.sqlLiteService.TxHistory.addOrUpdate(processedTx);
			}
		}
	}

	const controller = function() {};

	async function _syncByWallet(address, walletId, showProgress) {
		if (showProgress) {
			isSyncingMap[address] = true;
		}

		let WalletSettingTable = electron.app.sqlLiteService.WalletSetting;
		let endblock = await getMostResentBlock();
		endblock = parseInt(endblock, 16);

		let walletSettings = await WalletSettingTable.findByWalletId(walletId);
		let walletSetting = walletSettings[0];
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
					walletSetting.txHistoryLastSyncedBlock = endblock;
					await WalletSettingTable.edit(walletSetting);
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
				next(ethTxList.length == OFFSET || tokenTxList.length == OFFSET);
			})(true);
		});
	}

	async function sync() {
		let wallets = await electron.app.sqlLiteService.Wallet.findActive();
		for (let wallet of wallets) {
			let address = ('0x' + wallet.publicKey).toLowerCase();
			await _syncByWallet(address, wallet.id);
		}
	}

	function _startSyncingJob() {
		if (syncingJobIsStarted) {
			console.log('Transaction Syncing Job Is already Started!');
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
