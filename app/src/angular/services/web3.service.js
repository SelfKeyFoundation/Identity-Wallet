const Wallet = requireAppModule("angular/classes/wallet");
const EthUnits = requireAppModule("angular/classes/eth-units");
const EthUtils = requireAppModule("angular/classes/eth-utils");
const Token = requireAppModule("angular/classes/token");

const ABI = requireAppModule("angular/store/abi.json").abi;

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
function Web3Service(
	$rootScope,
	$window,
	$q,
	$timeout,
	$log,
	$http,
	$httpParamSerializerJQLike,
	EVENTS,
	ElectronService,
	CommonService,
	$interval,
	ConfigFileService,
	CONFIG
) {
	"ngInject";

	$log.info("Web3Service Initialized");

	/**
	 *
	 */
	const REQUEST_INTERVAL_DELAY = 500;

	/**
	 *
	 */
	const SERVER_CONFIG = {
		mew: {
			1: { url: "https://api.myetherapi.com/eth" },
			3: { url: "https://api.myetherapi.com/rop" }
		},
		infura: {
			1: { url: "https://mainnet.infura.io" },
			3: { url: "https://ropsten.infura.io" }
		}
	};

	const SELECTED_SERVER_URL = SERVER_CONFIG[CONFIG.node][CONFIG.chainId].url;

	let lastRequestTime = 0;
	const requestQueue = [];

	/**
	 *
	 */
	class Web3Service {
		constructor() {
			Web3Service.web3 = new Web3();

			Web3Service.web3.setProvider(
				new Web3Service.web3.providers.HttpProvider(SELECTED_SERVER_URL)
			);

			EthUtils.web3 = new Web3();
			window.EthUtils = EthUtils;

			Token.Web3Service = this;
			Token.$q = $q;

			Wallet.Web3Service = this;
			Web3Service.q = async.queue((data, callback) => {
				let baseFn = data.contract ? data.contract : Web3Service.web3.eth;
				let self = data.contract ? data.contract : this;
				let promise = baseFn[data.method].apply(self, data.args);

				$timeout(() => {
					callback(promise);
				}, REQUEST_INTERVAL_DELAY);
			}, 1);

			$rootScope.$on("balance:change", (event, symbol, value, valueInUsd) => {
				let self = this;
				let fn =
					symbol == "eth"
						? self.syncWalletActivityByETH
						: self.syncWalletActivityByContract;

				$timeout(() => {
					fn.call(self);
				}, 3000);
			});
		}

		syncWalletActivityByContract(key, address) {
			let currentWallet = $rootScope.wallet;
			if (!currentWallet || !currentWallet.getPublicKeyHex()) {
				return;
			}

			let contractInfos = [];
			let processAllContracts = !(key && address);
			let store = ConfigFileService.getStore();
			if (processAllContracts) {
				let tokens = store.tokens || {};
				Object.keys(tokens).forEach(tokenKey => {
					let value = tokens[tokenKey];
					if (value && value.contract && value.contract.address) {
						contractInfos.push({
							key: tokenKey,
							address: value.contract.address
						});
					}
				});
			} else {
				contractInfos.push({
					address,
					key
				});
			}

			if (!contractInfos.length) {
				return;
			}

			$rootScope.walletActivityStatuses = $rootScope.walletActivityStatuses || {};

			let publicKeyHex = $rootScope.wallet.getPublicKeyHex();
			let walletAddressHex = "0x" + publicKeyHex;
			let valueDivider = new BigNumber(10 ** 18);

			let storedWallet = store.wallets[publicKeyHex];
			let storedWalletData = storedWallet.data || {};
			let activities = (storedWalletData.activities = storedWalletData.activities || {});

			let getActivity = (contract, fromBlock, toBlock, filter) => {
				return this.getContractPastEvents(contract, [
					"Transfer",
					{
						filter: filter,
						fromBlock: fromBlock,
						toBlock: toBlock
					}
				]);
			};

			contractInfos.forEach(contractInfo => {
				$rootScope.walletActivityStatuses[contractInfo.key] = false;
				let contract = new Web3Service.web3.eth.Contract(ABI, contractInfo.address);
				let activity = (activities[contractInfo.key] = activities[contractInfo.key] || {});

				let processAllActivities = (fromBlock, toBlock) => {
					// TODO refactor on applay
					getActivity(contract, fromBlock, toBlock, {
						from: walletAddressHex
					}).then(logsFrom => {
						getActivity(contract, fromBlock, toBlock, {
							to: walletAddressHex
						}).then(logsTo => {
							activity.lastProccessedBlock = toBlock;
							activity.blocks = activity.blocks || {};

							let processLogs = (log, isFrom) => {
								let logBlockNumber = log.blockNumber;
								let block = (activity.blocks[logBlockNumber] =
									activity.blocks[logBlockNumber] || {});

								// reverse
								let fromOrTo = isFrom ? "to" : "from";
								block[log.transactionHash] = {
									[fromOrTo]: log.returnValues[fromOrTo],
									value: new BigNumber(log.returnValues.value)
										.div(valueDivider)
										.toString(),
									blockNumber: logBlockNumber
								};
							};

							if (logsFrom && logsFrom.length) {
								logsFrom.forEach(logFrom => {
									processLogs(logFrom, true);
								});
							}
							if (logsTo && logsTo.length) {
								logsTo.forEach(logTo => {
									processLogs(logTo, false);
								});
							}

							let transactions = [];
							Object.keys(activity.blocks).forEach(block => {
								let blockData = activity.blocks[block];

								Object.keys(blockData).forEach(transactionHash => {
									let transaction = blockData[transactionHash];
									transactions.push(transaction);
								});
							});

							activity.transactions = [];
							(function next() {
								if (!transactions.length) {
									activity.transactions.sort((a, b) => {
										return Number(b.timestamp) - Number(a.timestamp);
									});

									ConfigFileService.save()
										.then(store => {
											$rootScope.walletActivityStatuses[
												contractInfo.key
											] = true;
										})
										.catch(error => {});

									return;
								}

								let transaction = transactions.shift();
								if (transaction.timestamp) {
									activity.transactions.push(transaction);
									next();
								} else {
									Web3Service.getBlock(transaction.blockNumber, true).then(
										blockData => {
											transaction.timestamp = blockData.timestamp + "000";
											activity.transactions.push(transaction);
											next();
										}
									);
								}
							})();
						});
					});
				};

				this.getMostRecentBlockNumber().then(lastBlock => {
					let fromBlock = activity.lastProccessedBlock || lastBlock;

					processAllActivities(fromBlock, lastBlock);
				});
			});
		}

		getContractPastEvents(contract, args) {
			let defer = $q.defer();

			// wei
			Web3Service.waitForTicket(defer, "getPastEvents", args, contract);

			return defer.promise;
		}

		syncWalletActivityByETH() {
			let store = ConfigFileService.getStore();
			let walletKeys = Object.keys(store.wallets);
			let wallets = store.wallets;
			if (!walletKeys.length) {
				return;
			}

			let ethKey = "eth";
			$rootScope.walletActivityStatuses = $rootScope.walletActivityStatuses || {};
			$rootScope.walletActivityStatuses[ethKey] = false;

			let prefix = "0x";
			let valueDivider = new BigNumber(10 ** 18);

			walletKeys.forEach(key => {
				let wallet = wallets[key];
				let data = (wallet.data = wallet.data || {});
				data.activities = data.activities || {};
				let activities = (data.activities[ethKey] = data.activities[ethKey] || {});

				activities.blocks = activities.blocks || {};

				// remove last block we are processing again
				if (activities.lastBlockNumber) {
					delete activities.blocks[activities.lastBlockNumber];
				}
			});

			let anyWallet = wallets[walletKeys[0]];
			let previousLastBlockNumber = anyWallet.data.activities[ethKey].lastBlockNumber;

			let updateLastBlockNumber = lastBlockNumber => {
				walletKeys.forEach(key => {
					let wallet = wallets[key];
					wallet.data.activities[ethKey].lastBlockNumber = lastBlockNumber;
				});
			};

			let addNewTransaction = (blockNumber, key, transaction) => {
				let wallet = wallets[key];
				let blocks = wallet.data.activities[ethKey].blocks;

				let from = transaction.from ? transaction.from.toLowerCase() : null;
				let to = transaction.to ? transaction.to.toLowerCase() : null;
				key = (prefix + key).toLowerCase();
				if (key == to) {
					delete transaction.to;
				}
				if (key == from) {
					delete transaction.from;
				}

				let block = (blocks[blockNumber] = blocks[blockNumber] || {});
				block[transaction.hash] = transaction;
			};

			this.getMostRecentBlockNumber().then(blockNumber => {
				previousLastBlockNumber = previousLastBlockNumber || blockNumber;
				let blockNumbersToProcess = [];
				for (let i = previousLastBlockNumber; i <= blockNumber; i++) {
					blockNumbersToProcess.push(i);
				}
				updateLastBlockNumber(blockNumber);

				(function next() {
					if (blockNumbersToProcess.length === 0) {
						walletKeys.forEach(key => {
							let wallet = wallets[key];
							let activities = wallet.data.activities[ethKey];
							let blocks = activities.blocks;
							// reset transactions we will calculate from saved blocks
							let transactions = (activities.transactions = []);

							let blockKeys = Object.keys(blocks);
							blockKeys.forEach(blockKey => {
								let transactionHashes = blocks[blockKey];
								Object.keys(transactionHashes).forEach(hash => {
									let transaction = transactionHashes[hash];
									transactions.push(transaction);
								});
							});
							transactions.sort((a, b) => {
								return Number(b.timestamp) - Number(a.timestamp);
							});
						});

						ConfigFileService.save()
							.then(store => {
								$rootScope.walletActivityStatuses[ethKey] = true;
							})
							.catch(error => {});
						return;
					}

					let currentBlockNumber = blockNumbersToProcess.shift();
					Web3Service.getBlock(currentBlockNumber, true).then(blockData => {
						if (blockData) {
							if (blockData && blockData.transactions) {
								blockData.transactions.forEach(transaction => {
									let from = transaction.from
										? transaction.from.toLowerCase()
										: null;
									let to = transaction.to ? transaction.to.toLowerCase() : null;

									walletKeys.forEach(walletKey => {
										let fullAddressHex = (prefix + walletKey).toLowerCase();
										let value = transaction.value;
										if (
											value &&
											value != 0 &&
											(from == fullAddressHex || to == fullAddressHex)
										) {
											let value = new BigNumber(transaction.value)
												.div(valueDivider)
												.toString();
											if (value && value != 0) {
												addNewTransaction(currentBlockNumber, walletKey, {
													to: transaction.to,
													from: transaction.from,
													timestamp: blockData.timestamp + "000",
													hash: transaction.hash,
													value: value
												});
											}
										}
									});
								});
							}
						}
						next();
					});
				})();
			});
		}

		static getBlock(blockNumber, withTransactions) {
			withTransactions = withTransactions || false;
			let defer = $q.defer();

			// wei
			Web3Service.waitForTicket(defer, "getBlock", [blockNumber, withTransactions]);

			return defer.promise;
		}

		getMostRecentBlockNumber() {
			let defer = $q.defer();

			// wei
			Web3Service.waitForTicket(defer, "getBlockNumber", []);

			return defer.promise;
		}

		getBalance(addressHex) {
			let defer = $q.defer();

			// wei
			Web3Service.waitForTicket(defer, "getBalance", [addressHex]);

			return defer.promise;
		}

		getTokenBalanceByData(data) {
			let defer = $q.defer();

			// wei
			Web3Service.waitForTicket(defer, "call", [data]);

			return defer.promise;
		}

		getEstimateGas(fromAddressHex, toAddressHex, amountHex) {
			let defer = $q.defer();

			let args = {
				from: fromAddressHex,
				to: toAddressHex,
				value: amountHex
			};

			// wei
			Web3Service.waitForTicket(defer, "estimateGas", [args]);

			return defer.promise;
		}

		getGasPrice() {
			let defer = $q.defer();

			// wei
			Web3Service.waitForTicket(defer, "getGasPrice", []);

			return defer.promise;
		}

		getTransactionCount(addressHex) {
			let defer = $q.defer();

			// number
			Web3Service.waitForTicket(defer, "getTransactionCount", [addressHex, "pending"]);

			return defer.promise;
		}

		sendRawTransaction(signedTxHex) {
			let defer = $q.defer();

			Web3Service.waitForTicket(defer, "sendSignedTransaction", [signedTxHex]);

			return defer.promise;
		}

		getTransaction(transactionHex) {
			let defer = $q.defer();

			Web3Service.waitForTicket(defer, "getTransaction", [transactionHex]);

			return defer.promise;
		}

		getTransactionReceipt(transactionHex) {
			let defer = $q.defer();

			Web3Service.waitForTicket(defer, "getTransactionReceipt", [transactionHex]);

			return defer.promise;
		}

		static handlePromise(defer, promise) {
			promise
				.then(response => {
					$log.info("response", response);
					defer.resolve(response);
				})
				.catch(error => {
					$log.error("error", error);
					defer.reject(error);
				});
		}

		static waitForTicket(defer, method, args, contract) {
			Web3Service.q.push({ method: method, args: args, contract: contract }, promise => {
				Web3Service.handlePromise(defer, promise);
			});
		}
	}

	return new Web3Service();
}

module.exports = Web3Service;
