'use strict';

var Web3 = require('web3');
const async = require('async');
const CONFIG = require('../config');

const ABI = require('../assets/data/abi.json').abi;
const REQUEST_INTERVAL_DELAY = 500;

const SERVER_CONFIG = {
	mew: {
		1: { url: 'https://api.myetherapi.com/eth' },
		3: { url: 'https://api.myetherapi.com/rop' }
	},
	infura: {
		1: { url: 'https://mainnet.infura.io' },
		3: { url: 'https://ropsten.infura.io' }
	}
};

const SELECTED_SERVER_URL = SERVER_CONFIG[CONFIG.node][CONFIG.chainId].url;

module.exports = function(app) {
	const controller = function() {
		let self = this;

		let standardWeb3 = (self.standardWeb3 = new Web3());
		standardWeb3.setProvider(new standardWeb3.providers.HttpProvider(SELECTED_SERVER_URL));

		self.q = async.queue((data, callback) => {
			let promise = null;
			if (data.contractAddress) {
				let contract = new standardWeb3.eth.Contract(ABI, data.contractAddress);
				if (data.contractMethod) {
					promise = contract.methods[data.contractMethod]()[data.method].apply(
						self,
						data.args
					);
				} else {
					promise = contract[data.method].apply(contract, data.args);
				}
			} else {
				promise = standardWeb3.eth[data.method].apply(self, data.args);
			}
			setTimeout(() => {
				callback(promise);
			}, REQUEST_INTERVAL_DELAY);
		}, 1);
	};

	controller.prototype.getSelectedServerURL = () => {
		return SELECTED_SERVER_URL;
	};

	/**
	 *
	 * @param { method, args, contractAddress, contractMethod } args
	 *
	 *
	 */
	controller.prototype.waitForTicket = function(args) {
		let self = this;
		return new Promise((resolve, reject) => {
			self.q.push(args, promise => {
				if (!promise) {
					return reject();
				}

				promise.catch(err => {
					reject(err);
				});

				if (args.onceListenerName) {
					promise.once(args.onceListenerName, res => {
						resolve(res);
					});
				} else {
					promise.then(res => {
						resolve(res);
					});
				}
			});
		});
	};

	return controller;
};
