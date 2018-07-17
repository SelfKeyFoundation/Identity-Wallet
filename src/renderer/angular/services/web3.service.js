const EthUtils = require('../classes/eth-utils');
const Web3 = require('web3');
const { Logger } = require('common/logger');
const log = new Logger('Web3Service');
// documentation
// https://www.myetherapi.com/
function Web3Service($rootScope, $window, EVENTS, SqlLiteService, RPCService) {
	'ngInject';

	log.info('Web3Service Initialized');

	class Web3Service {
		constructor() {
			Web3Service.web3 = new Web3();
			EthUtils.web3 = new Web3();
			window.EthUtils = EthUtils;
		}

		getContractInfo(contractAddress) {
			let decimalsPromise = Web3Service.waitForTicket(
				'call',
				[],
				contractAddress,
				'decimals'
			);
			let symbolPromise = Web3Service.waitForTicket('call', [], contractAddress, 'symbol');

			return Promise.all([decimalsPromise, symbolPromise]);
		}

		getMostRecentBlockNumber() {
			return Web3Service.waitForTicket('getBlockNumber', []);
		}

		static getMostRecentBlockNumberStatic() {
			return Web3Service.waitForTicket('getBlockNumber', []);
		}

		getBalance(addressHex) {
			return Web3Service.waitForTicket('getBalance', [addressHex]);
		}

		getTokenBalanceByData(data) {
			return Web3Service.waitForTicket('call', [data]);
		}

		getEstimateGas(fromAddressHex, toAddressHex, amountHex) {
			let args = {
				from: fromAddressHex,
				to: toAddressHex,
				value: amountHex
			};

			return Web3Service.waitForTicket('estimateGas', [args]);
		}

		getGasPrice() {
			return Web3Service.waitForTicket('getGasPrice', []);
		}

		getTransactionCount(addressHex) {
			return Web3Service.waitForTicket('getTransactionCount', [addressHex, 'pending']);
		}

		sendRawTransaction(signedTxHex) {
			let onceListenerName = 'transactionHash';
			return Web3Service.waitForTicket(
				'sendSignedTransaction',
				[signedTxHex],
				null,
				null,
				onceListenerName
			);
		}

		getTransaction(transactionHex) {
			return Web3Service.waitForTicket('getTransaction', [transactionHex]);
		}

		getTransactionReceipt(transactionHex) {
			return Web3Service.waitForTicket('getTransactionReceipt', [transactionHex]);
		}

		static getBlock(blockNumber, withTransactions) {
			withTransactions = withTransactions || false;
			return Web3Service.waitForTicket('getBlock', [blockNumber, withTransactions]);
		}

		static waitForTicket(method, args, contractAddress, contractMethod, onceListenerName) {
			return RPCService.makeCall('waitForWeb3Ticket', {
				method,
				args,
				contractAddress,
				contractMethod,
				onceListenerName
			});
		}
	}

	return new Web3Service();
}
Web3Service.$inject = ['$rootScope', '$window', 'EVENTS', 'SqlLiteService', 'RPCService'];
module.exports = Web3Service;
