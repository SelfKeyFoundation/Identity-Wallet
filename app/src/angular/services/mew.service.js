"use strict";

const Token = requireAppModule("angular/classes/token");
const EthUtils = requireAppModule("angular/classes/eth-utils");

function dec2hexString(dec) {
	return (
		"0x" +
		(dec + 0x10000)
			.toString(16)
			.substr(-4)
			.toUpperCase()
	);
}

// documentation
// https://www.myetherapi.com/
function MEWService(
	$rootScope,
	$window,
	$q,
	$timeout,
	$log,
	$http,
	$httpParamSerializerJQLike,
	EVENTS,
	ElectronService,
	CommonService
) {
	"ngInject";

	$log.info("MEWService Initialized");

	// etehrscan
	const DEFAULT_SERVER = "etehrscan";

	// ropsten testnet
	const DEFAULT_CHAIN_ID = 3;

	// TODO move this into constants & configs
	const SERVER_CONFIG = {
		etehrscan: {
			1: { url: "https://api.myetherapi.com/eth" }, // chainId : { "api url", key )
			3: { url: "https://api.myetherapi.com/rop" } // chainId : { "api url", key )
		}
	};

	let CHAIN_ID = null;
	let SERVER_URL = null;
	let API_KEY = null;

	setChainId(DEFAULT_CHAIN_ID);

	const REQUEST_CONFIG = {
		headers: {
			"Content-Type": "application/json"
		}
	};

	function setChainId(newChainId) {
		CHAIN_ID = newChainId;
		SERVER_URL = SERVER_CONFIG[DEFAULT_SERVER][newChainId].url;
		API_KEY = SERVER_CONFIG[DEFAULT_SERVER][newChainId].key;
	}

	/**
	 *
	 */
	class MEWService {
		constructor() {
			$rootScope.$on(EVENTS.CHAIN_ID_CHANGED, (event, newChainId) => {
				setChainId(newChainId);
			});
		}

		getBalance(address) {
			let defer = $q.defer();

			let data = {
				id: CommonService.generateId(),
				method: "eth_getBalance",
				jsonrpc: "2.0",
				params: ["0x" + address, "pending"]
			};

			let promise = $http.post(SERVER_URL, data, REQUEST_CONFIG);

			MEWService.handlePromise(defer, promise);

			return defer.promise;
		}

		getEstimateGas(fromAddress, toAddress, amount) {
			let defer = $q.defer();

			let amountHex = dec2hexString(amount); // "0x429d069189e0000";

			let data = {
				id: CommonService.generateId(),
				method: "eth_estimateGas",
				jsonrpc: "2.0",
				params: [
					{
						from: "0x" + fromAddress,
						to: "0x" + toAddress,
						value: amountHex
					}
				]
			};

			let promise = $http.post(SERVER_URL, data, REQUEST_CONFIG);
			MEWService.handlePromise(defer, promise);

			return defer.promise;
		}

		getGasPrice() {
			let defer = $q.defer();

			let data = {
				id: CommonService.generateId(),
				method: "eth_gasPrice",
				jsonrpc: "2.0",
				params: []
			};

			let promise = $http.post(SERVER_URL, data, REQUEST_CONFIG);
			MEWService.handlePromise(defer, promise);

			return defer.promise;
		}

		getTransactionCount(address) {
			let defer = $q.defer();

			let data = {
				id: CommonService.generateId(),
				method: "eth_getTransactionCount",
				jsonrpc: "2.0",
				params: ["0x" + address, "pending"]
			};

			let promise = $http.post(SERVER_URL, data, REQUEST_CONFIG);
			MEWService.handlePromise(defer, promise);

			return defer.promise;
		}

		sendRawTransaction(trxSignedHex) {
			let defer = $q.defer();

			let data = {
				id: CommonService.generateId(),
				method: "eth_sendRawTransaction",
				jsonrpc: "2.0",
				params: ["0x" + trxSignedHex]
			};

			let promise = $http.post(SERVER_URL, data, REQUEST_CONFIG);
			MEWService.handlePromise(defer, promise);

			return defer.promise;
		}

		static handlePromise(defer, promise) {
			promise
				.then(response => {
					if (response.error || response.errorMessage || !response.result) {
						defer.reject(
							$rootScope.buildErrorObject("mew_api_error", response.data.error)
						);
					} else {
						defer.resolve(response.result);
					}
				})
				.catch(error => {
					defer.reject($rootScope.buildErrorObject("ERR_HTTP_CONNECTION", error));
				});
		}
	}

	return new MEWService();
}

module.exports = MEWService;
