'use strict';

const Wallet = require('../classes/wallet');
const Token = require('../classes/token');

function SignService($rootScope, $log, LedgerService) {
	'ngInject';

	$log.debug('SignService Initialized');

	let SignService = function() {
		Wallet.SignService = this;
		Token.SignService = this;

		this.signTranactionByPrivateKey = function(rawTx, privateKey) {
			return new Promise(resolve => {
				let eTx = new Tx(rawTx);
				eTx.sign(privateKey);
				resolve('0x' + eTx.serialize().toString('hex'));
			});
		};

		this.signTransactionByLedger = function(dataToSign, address, derivationPath) {
			return LedgerService.signTransaction(dataToSign, address, derivationPath);
		};

		this.signTransaction = function(args) {
			let { rawTx, profile, privateKey, walletAddress } = args;
			if (profile == 'ledger') {
				let derivationPath = $rootScope.selectedLedgerAccount.derivationPath;
				return this.signTransactionByLedger(rawTx, walletAddress, derivationPath);
			}

			if (profile == 'local') {
				return this.signTranactionByPrivateKey(rawTx, privateKey);
			}
		};
	};

	return new SignService();
}

SignService.$inject = ['$rootScope', '$log', 'LedgerService'];

module.exports = SignService;
