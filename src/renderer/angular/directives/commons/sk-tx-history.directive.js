'use strict';

function SKTxHistoryDirective($rootScope, $interval, RPCService, CommonService) {
	'ngInject';

	return {
		restrict: 'E',
		scope: {
			tokenSymbol: '@'
		},
		link: (scope, element) => {
            let publicKey = '0x' + $rootScope.wallet.getPublicKey();
            let publicKeyLowerCase = publicKey.toLowerCase(); 

			let syncByWallet = showProgress => {
				RPCService.makeCall('syncTxHistoryByWallet', {
					walletId: $rootScope.wallet.id,
					publicKey: publicKeyLowerCase,
					showProgress
				});
			};

			$rootScope.txHistoryIsFirstSync =
				typeof $rootScope.txHistoryIsFirstSync == 'undefined' ? true : false;
			syncByWallet($rootScope.txHistoryIsFirstSync);

			scope.txList = [];
			scope.tokenSymbol = scope.tokenSymbol ? scope.tokenSymbol.toUpperCase() : null;

			let getTxStatusText = tx => {
				let status = tx.txReceiptStatus;
				let isSend = tx.from == publicKeyLowerCase;

				if (status == 0) {
					return isSend ? 'Faild To Send' : 'Faild To Receive';
				}
				if (status == 1) {
					return isSend ? 'Sent' : 'Received';
				}
				return isSend ? 'Sending' : 'Sending';
			};

			let getTxStatusIcon = tx => {
				let status = tx.txReceiptStatus;
				let isSend = tx.from == publicKeyLowerCase;

				if (status == 1) {
					return isSend ? 'sent' : 'receive';
				}

				if (status == 0) {
					return 'fail';
				}

				return 'clock';
			};

			let processTxHistoryList = list => {
				return list.map(tx => {
					let symbol = tx.tokenSymbol;
					tx.symbol = symbol ? symbol.toUpperCase() : 'ETH';
					tx.directionSign = publicKeyLowerCase == tx.from ? '- ' : '+ ';

					tx.externalLink = `https://etherscan.io/tx/${tx.hash}`;
					tx.statusText = getTxStatusText(tx);
					tx.statusIcon = getTxStatusIcon(tx);

					return tx;
				});
			};

			let loadData = () => {
				let fn,
					fnArgs = { publicKey: publicKeyLowerCase };
				if (scope.tokenSymbol) {
					if (scope.tokenSymbol == 'ETH') {
						fn = 'getByPublicKeyAndContractAddress';
						fnArgs.contractAddress = null;
					} else {
						fn = 'getTxHistoryByPublicKeyAndTokenSymbol';
						fnArgs.tokenSymbol = scope.tokenSymbol;
					}
				}

				fn = fn || 'getTxHistoryByPublicKey';
				let transactions = RPCService.makeCall(fn, fnArgs)
					.then(res => {
						scope.txList = processTxHistoryList(res.data);
						scope.isSyncing = res.isSyncing;
					})
					.catch(err => {
						scope.isSyncing = false;
						CommonService.showToast(
							'error',
							'Error while loading transactions history.'
						);
					});
			};

			loadData();

			$rootScope.$on('balance:change', event => {
				loadData();
			});

			$rootScope.$on('tx-history:change', event => {
				loadData();
			});

			$rootScope.$on('tx-history:sync', event => {
				scope.isSyncing = true;
				syncByWallet(true);
			});

			let txReloadInterval = $interval(() => {
				loadData();
			}, 3000);

			element.on('$destroy', function() {
				$interval.cancel(txReloadInterval);
			});
		},
		replace: true,
		templateUrl: 'common/directives/sk-tx-history.html'
	};
}

SKTxHistoryDirective.$inject = ['$rootScope', '$interval', 'RPCService', 'CommonService'];

module.exports = SKTxHistoryDirective;
