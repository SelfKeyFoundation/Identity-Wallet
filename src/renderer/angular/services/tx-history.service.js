'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('TxHistoryService');
function TxHistoryService($rootScope, CONFIG, RPCService) {
	'ngInject';

	log.info('TxHistoryService Initialized');

	let TxHistoryService = function() {
		/**
		 *
		 * @param {*} p sendTransaction promise
		 * @param {*} args
		 */
		this.insertPandingTx = function(p, args) {
			p.then(hash => {
				if (hash) {
					args.hash = hash;
					args.networkId = CONFIG.chainId;
					args.from = ('0x' + $rootScope.wallet.getPublicKeyHex()).toLowerCase();

					if (args.tokenSymbol) {
						args.tokenSymbol = args.tokenSymbol.toUpperCase();
						let token = $rootScope.wallet.tokens[args.tokenSymbol];
						args.contractAddress = token.contractAddress;
						args.tokenDecimal = token.decimal;
					}

					let now = new Date().getTime();
					args.timeStamp = now;
					args.createdAt = now;

					RPCService.makeCall('txHistoryAddOrUpdate', args);
				}
			});
		};
	};

	return new TxHistoryService();
}

TxHistoryService.$inject = ['$rootScope', 'CONFIG', 'RPCService'];

module.exports = TxHistoryService;
