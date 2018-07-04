'use strict';

const electron = require('electron'),
	{ timeout, TimeoutError } = require('promise-timeout'),
	Web3 = require('web3'),
	ProviderEngine = require('web3-provider-engine'),
	FetchSubprovider = require('web3-provider-engine/subproviders/fetch'),
	Transport = require('@ledgerhq/hw-transport-node-hid').default,
	createLedgerSubprovider = require('@ledgerhq/web3-subprovider').default,
	NETWORK_ID = require('../config').chainId,
	SELECTED_SERVER_URL = require('./web3-service').SELECTED_SERVER_URL;

module.exports = function(app) {
	const controller = function() {};

	function createWeb3(accountsOffset, accountsQuantity) {
		accountsOffset = accountsOffset || 0;
		accountsQuantity = accountsQuantity || 6;
		const engine = new ProviderEngine();
		const getTransport = () => Transport.create();
		const ledger = createLedgerSubprovider(getTransport, {
			networkId: NETWORK_ID,
			accountsLength: accountsQuantity,
			accountsOffset
		});

		engine.addProvider(ledger);
		engine.addProvider(new FetchSubprovider({ rpcUrl: SELECTED_SERVER_URL }));
		engine.start();
		return new Web3(engine);
	}

	async function _signTransaction(args) {
		args.dataToSign.from = args.address;
		let signPromise = electron.app.web3Service.waitForTicket({
			method: 'signTransaction',
			args: [args.dataToSign],
			contractAddress: null,
			contractMethod: null,
			onceListenerName: null,
			customWeb3: createWeb3()
		});

		return timeout(signPromise, 30000);
	}

	async function _getAccounts(args) {
		return electron.app.web3Service.waitForTicket({
			method: 'getAccounts',
			args: [],
			contractAddress: null,
			contractMethod: null,
			onceListenerName: null,
			customWeb3: createWeb3(args.start, args.quantity)
		});
	}

	controller.prototype.getAccounts = _getAccounts;
	controller.prototype.signTransaction = _signTransaction;

	return controller;
};
