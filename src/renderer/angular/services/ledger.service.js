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
				accounts.forEach(address => {
					let fn = callback => {
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
					fns[address] = fn;
				});

				window.async.parallel(fns, callback);
			};

			return new Promise((resolve, reject) => {
				RPCService.makeCall('getLedgerAccounts', args)
					.then(accounts => {
						if (!accounts || accounts.length == 0) {
							reject('ACCOUNTS_NOT_FOUND');
							return;
						}

						loadBalances(accounts, (err, results) => {
							if (err) {
								reject(err);
								return;
							}

							let accountsArr = Object.keys(results)
								.map(address => {
									return {
										address,
										balanceEth: results[address]
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

		signTransaction(dataToSign, address) {
			return RPCService.makeCall('signTransactionWithLedger', {
				dataToSign,
				address
			});
		}
	}

	return new LedgerService();
}

LedgerService.$inject = ['$log', 'RPCService', 'CommonService', 'Web3Service'];

module.exports = LedgerService;
