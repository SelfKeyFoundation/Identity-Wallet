'use strict';

const Promise = require('bluebird'),
    electron = require('electron'),
    path = require('path'),
    config = require('../config'),
    request = require('request'),
    async = require('async'),
    BigNumber = require('bignumber.js');


let isSyncing = false;
let syncingJobIsStarted = false;

let getIsSyncing = () => {
    return isSyncing;
};

let defaultModule = function (app) {
    const API_KEY = null;
    const REQUEST_INTERVAL_DELAY = 600; // millis
    const RECORDS_COUNT = 1000;
    const LAST_BLOCK = Number.MAX_SAFE_INTEGER;
    const ETH_BALANCE_DIVIDER = new BigNumber(10 ** 18);
    const ENDPOINT_CONFIG = {
        1: { url: 'https://api.etherscan.io/api' },
        3: { url: "http://api-ropsten.etherscan.io/api" }
    };
    const API_ENDPOINT = ENDPOINT_CONFIG[config.chainId].url;
    const TX_LIST_ACTION = `?module=account&action=txlist&startblock=0&endblock=${LAST_BLOCK}&sort=asc`;
    const TOKEN_TX_ACTION = `?module=account&action=tokentx&startblock=0&endblock=${LAST_BLOCK}&sort=asc`;
    const TX_RECEIPT_ACTION = '?module=proxy&action=eth_getTransactionReceipt';

    //in order to change key name in runtime
    const KEY_MAP = {
        'txreceipt_status': 'txReceiptStatus'
    };

    const KNOWN_KEYS = ['blockNumber', 'timeStamp', 'hash', 'nonce', 'blockHash',
        'transactionIndex', 'from', 'to', 'value', 'gas', 'gasPrice', 'isError',
        'txreceipt_status', 'input', 'contractAddress', 'cumulativeGasUsed',
        'gasUsed', 'confirmations', 'tokenName', 'tokenSymbol', 'tokenDecimal'];

    let queue = async.queue(async (args, callback) => {
        let result = await makeRequest.apply(this, [args.method, args.url, args.data])
        setTimeout(() => {
            callback(result);
        }, REQUEST_INTERVAL_DELAY);
    }, 1);

    function loadEthTxHistory(address) {
        return new Promise((resolve, reject) => {
            const ACTION_URL = API_ENDPOINT + TX_LIST_ACTION + '&address=' + address;
            queue.push({ method: 'get', url: ACTION_URL }, (promise) => {
                resolve(promise);
            });
        })
    }

    function loadERCTxHistory(address) {
        return new Promise((resolve, reject) => {
            const ACTION_URL = API_ENDPOINT + TOKEN_TX_ACTION + '&address=' + address;
            queue.push({ method: 'get', url: ACTION_URL }, (promise) => {
                resolve(promise);
            });
        })
    }

    function getTransactionReceipt(txhash) {
        return new Promise((resolve, reject) => {
            const ACTION_URL = API_ENDPOINT + TX_RECEIPT_ACTION + '&txhash=' + txhash;
            queue.push({ method: 'get', url: ACTION_URL }, (promise) => {
                resolve(promise);
            });
        })
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
     
        console.log('contractAddress', contractAddress);
        try {
            let tokenDecimal = await Web3Service.waitForTicket({ method: 'call', args: [], contractAddress, contractMethod: 'decimals' });
            let tokenSymbol = await Web3Service.waitForTicket({ method: 'call', args: [], contractAddress, contractMethod: 'symbol' });
            let tokenName = await Web3Service.waitForTicket({ method: 'call', contractAddress, contractMethod: 'name' });
            return {tokenDecimal,tokenSymbol,tokenName}
            
        } catch(err) {
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

        KNOWN_KEYS.forEach((key) => {
            let processedKey = KEY_MAP[key] ? KEY_MAP[key] : key;
            processedTx[processedKey] = propperTx[key];
        });

        //TODO if .value is 0 and it is .eth, it means that it is token's transactions
        //so we have to check from/to? and getTokenInformation by to/from address, and process result!
        //TODO at first try to check in tokebs db localy
        // set concratct address, symbol, name
        // wait for web3 changes merging


        //toString is important! in order to avoid exponential
        processedTx.value = new BigNumber(processedTx.value).div(balanceValueDivider).toString(10);
        processedTx.tokenSymbol = processedTx.tokenSymbol ? processedTx.tokenSymbol.toUpperCase() : null;

        processedTx.from = processedTx.from ? processedTx.from.toLowerCase() : null;
        processedTx.to = processedTx.to ? processedTx.to.toLowerCase() : null;

        processedTx.contractAddress = processedTx.contractAddress || null; // iportant for find by eth
        if (processedTx.txReceiptStatus == null) {
            let txReceipt = await getTransactionReceipt(processedTx.hash);
            if (txReceipt) {
                processedTx.txReceiptStatus = parseInt(txReceipt.status, 16) || -1; //TODO
            }
        }

        //faild transaction
        if (processedTx.value == 0) {
            //set faild status, there is some exeptions, so that's needed 
            processedTx.txReceiptStatus = 0; 

            processedTx.from == walletAddress ?
                processedTx.contractAddress = processedTx.to :
                processedTx.contractAddress = processedTx.from;

                
            let contractInfo = await getContractInfo(processedTx.contractAddress);
            if (contractInfo == 0) {
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

    const controller = function () { };


    async function startSyncing() {

        let wallets = await electron.app.sqlLiteService.Wallet.findAll();
        for (let wallet of wallets) {


            let address = '0xb198F16C4C4eB5d67cFA2d6297D0E779735736A2'.toLowerCase(); //fealured cases.
            //let address = ('0x' + wallet.publicKey).toLowerCase();
            let ethTxList = await loadEthTxHistory(address);
            let tokenTxList = await loadERCTxHistory(address);

            let txHashes = {};
            ethTxList.concat(tokenTxList).forEach((tx, index) => {
                let hash = tx.hash;
                txHashes[hash] = txHashes[hash] || {};
                let isToken = index >= ethTxList.length;
                txHashes[hash][isToken ? 'token' : 'eth'] = tx;
            });

            await processTxHistory(txHashes, address);
        }
        isSyncing = false;
    };

    function startSyncingJob() {
        if (syncingJobIsStarted) {
            console.log('Transaction Syncing Job Is already Started!');
            return;
        }

        syncingJobIsStarted = true;
        isSyncing = true;
        (async function next() {
            await startSyncing();
            next();
        })();
    };

    controller.prototype.startSyncingJob = startSyncingJob;

    return controller;
};

module.exports = {
    default: defaultModule,
    isSyncing: getIsSyncing
};
