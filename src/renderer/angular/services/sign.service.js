'use strict';
const { Logger } = require('common/logger');
const log = new Logger('SignService');
const Wallet = require('../classes/wallet');
const Token = require('../classes/token');
const Tx = require('ethereumjs-tx');

function SignService($rootScope, LedgerService) {
	'ngInject';

	log.debug('SignService Initialized');

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

		this.signTransactionByLedger = function(dataToSign, address) {
			return LedgerService.signTransaction(dataToSign, address).then(res => {
				return res.raw;
			});
		};

		this.signTransaction = function(args) {
			let { rawTx, profile, privateKey, walletAddress } = args;
			if (profile === 'ledger') {
				return this.signTransactionByLedger(rawTx, walletAddress);
			}

			if (profile === 'local') {
				return this.signTranactionByPrivateKey(rawTx, privateKey);
			}
		};
	};

	return new SignService();
}

SignService.$inject = ['$rootScope', 'LedgerService'];

module.exports = SignService;
