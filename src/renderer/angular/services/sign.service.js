'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('SignService');
const Wallet = require('../classes/wallet');
const Token = require('../classes/token');
const Tx = require('ethereumjs-tx');

function SignService($rootScope, HardwareWalletService) {
	'ngInject';

	log.info('SignService Initialized');

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

		this.signWithHardwareWallet = function(dataToSign, address, profile) {
			return HardwareWalletService.signTransaction(dataToSign, address, profile).then(res => {
				return res.raw;
			});
		};

		this.signTransaction = function(args) {
			let { profile, isHardwareWallet } = $rootScope.wallet;
			let { rawTx, privateKey, walletAddress } = args;

			if (isHardwareWallet) {
				return this.signWithHardwareWallet(rawTx, walletAddress, profile);
			}

			if (profile === 'local') {
				return this.signTranactionByPrivateKey(rawTx, privateKey);
			}
		};
	};

	return new SignService();
}

SignService.$inject = ['$rootScope', 'HardwareWalletService'];

module.exports = SignService;
