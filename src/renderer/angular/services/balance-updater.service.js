'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('BalanceUpdaterService');
function BalanceUpdaterService($rootScope, $interval, Web3Service, RPCService) {
	'ngInject';

	log.info('BalanceUpdaterService Initialized');

	let txInfoCheckInterval = null;
	const TX_CHECK_INTERVAL = 1000;

	const updateBalances = async oldBalance => {
		let walletUpdaterPromise = RPCService.makeCall('getWalletByPublicKey', {
			publicKey: $rootScope.wallet.getPublicKey()
		});
		let tokensUpdaterPromise = RPCService.makeCall('getWalletTokens', {
			walletId: $rootScope.wallet.id
		});

		await Promise.all([walletUpdaterPromise, tokensUpdaterPromise]);
		let currentWallet = await RPCService.makeCall('getCurrentWallet');
		console.log(oldBalance, currentWallet.balance);
		if (oldBalance === currentWallet.balance) {
			updateBalances(oldBalance);
		}
	};

	function startTxCheck(txHash, currentBalance) {
		txInfoCheckInterval = $interval(() => {
			let txInfoPromise = Web3Service.getTransactionReceipt(txHash);
			txInfoPromise
				.then(txInfo => {
					if (txInfo && txInfo.blockNumber !== null) {
						let status = Number(txInfo.status);
						$rootScope.$broadcast('tx-status:change', txHash, status);
						if (status) {
							updateBalances(currentBalance);
						}
						$interval.cancel(txInfoCheckInterval);
					}
				})
				.catch(error => {
					log.error(error);
				});
		}, TX_CHECK_INTERVAL);
	}

	let BalanceUpdaterService = function() {
		this.startTxBalanceUpdater = async sendPromise => {
			let currentWallet = await RPCService.makeCall('getCurrentWallet');
			sendPromise.then(txHash => {
				startTxCheck(txHash, currentWallet.balance);
			});
		};
	};

	return new BalanceUpdaterService();
}

BalanceUpdaterService.$inject = ['$rootScope', '$interval', 'Web3Service', 'RPCService'];

module.exports = BalanceUpdaterService;
