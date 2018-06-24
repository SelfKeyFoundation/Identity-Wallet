'use strict';
const EthUnits = require('../classes/eth-units');

function LedgerService($log, RPCService, CommonService, Web3Service) {
	'ngInject';

	$log.info('LedgerService Initialized');

	class LedgerService {
		constructor() {}

		getAccountsWithBalances(args) {
			const loadBalances = (accounts, callback) => {
				let fns = {};
				Object.keys(accounts).forEach(derivationPath => {
					let fn = callback => {
						let address = accounts[derivationPath];
						let promise = Web3Service.getBalance(address);

						promise
							.then(balanceWei => {
								let balanceEth = EthUnits.toEther(balanceWei, 'wei');
								callback(
									null,
									Number(CommonService.numbersAfterComma(balanceEth, 15))
								);
							})
							.catch(err => {
								callback(err);
							});
					};
					fns[derivationPath] = fn;
				});

				window.async.parallel(fns, callback);
			};

			return new Promise((resolve, reject) => {
				RPCService.makeCall('getLedgerAccounts', args)
					.then(accounts => {
						if (!accounts || Object.keys(accounts).length == 0) {
							reject();
							return;
						}

						loadBalances(accounts, (err, results) => {
							if (err) {
								reject(err);
								return;
							}

							let accountsArr = Object.keys(results)
								.map(derivationPath => {
									return {
										address: accounts[derivationPath],
										derivationPath: derivationPath,
										balanceEth: results[derivationPath]
									};
								})
								.sort((a, b) => {
									return parseFloat(b.balanceEth) - parseFloat(a.balanceEth);
								});
							resolve(accountsArr);
						});
					})
					.catch(err => {
						reject(err);
					});
			});
		}

		createWalletByAddress(address) {
			return RPCService.makeCall('createLedgerWalletByAdress', { address });
		}

		signTransaction(dataToSign, address, derivationPath) {
			return new Promise((resolve, reject) => {
				RPCService.makeCall('signTransactionWithLedger', {
					dataToSign,
					address,
					derivationPath
				})
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						reject(err);
					});
			});
		}
	}

	return new LedgerService();
}

LedgerService.$inject = ['$log', 'RPCService', 'CommonService', 'Web3Service'];

module.exports = LedgerService;
