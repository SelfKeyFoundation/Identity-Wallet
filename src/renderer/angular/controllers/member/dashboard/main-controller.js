'use strict';

function MemberDashboardMainController(
	$rootScope,
	$scope,
	$interval,
	$log,
	$q,
	$timeout,
	$mdSidenav,
	$state,
	$filter,
	CommonService,
	RPCService,
	SqlLiteService,
	SelfkeyService,
	Web3Service
) {
	'ngInject';

	$log.info('MemberDashboardMainController', $rootScope.wallet);

	RPCService.makeCall('getWalletSettingsByWalletId', $rootScope.wallet.id).then(
		walletSettings => {
			if (walletSettings && walletSettings.length > 0) {
				let walletSetting = walletSettings[0];
				if (walletSetting.airDropCode) {
					SelfkeyService.triggerAirdrop(walletSetting.airDropCode).then(() => {
						SqlLiteService.removeAirdropCode();
					});
				}
			}
		}
	);

	$scope.openEtherscanTxWindow = event => {
		$rootScope.openInBrowser(
			'https://etherscan.io/address/0x' + $rootScope.wallet.getPublicKeyHex(),
			true
		);
	};

	let pieChartIsReady = false;

	let wallet = $rootScope.wallet;
	$scope.transactionsHistoryList = [];

	$scope.setTransactionsHistory = () => {
		SqlLiteService.getTransactionsHistoryByWalletId(wallet.id)
			.then(data => {
				$scope.transactionsHistoryList = data
					? $rootScope.wallet.processTransactionsHistory(data)
					: [];
			})
			.catch(err => {
				// TODO
			});
	};

	$scope.setTransactionsHistory();

	$scope.transactionsHistoryIsSynced = () => {
		let statuses = $rootScope.transactionHistorySyncStatuses;
		let isInProgress = false;
		if (statuses) {
			Object.keys(statuses).forEach(key => {
				if (statuses[key] == false) {
					isInProgress = true;
				}
			});
		}
		return !isInProgress;
	};

	$rootScope.refreshTxHistory = symbol => {
		if (!symbol) {
			$rootScope.wallet.syncEthTransactionsHistory();
			Web3Service.syncTokensTransactionHistory(symbol);
			return;
		}

		if (symbol.toLowerCase() == 'eth') {
			$rootScope.wallet.syncEthTransactionsHistory();
		} else {
			Web3Service.syncTokensTransactionHistory(symbol);
		}
	};

	$scope.getPieChartItems = () => {
		let pieChartItems = [];
		Object.keys(wallet.tokens).forEach(tokeyKey => {
			let pieChartItem = {};
			let token = wallet.tokens[tokeyKey];
			if (token.isHidden()) {
				return;
			}
			let tokenPrice = SqlLiteService.getTokenPriceBySymbol(token.symbol.toUpperCase());
			if (tokenPrice) {
				pieChartItem.title = tokenPrice.name;
				pieChartItem.valueUSD = token.getBalanceInUSD();
				pieChartItem.amount = token.getFormattedBalance();
				//token
			} else {
				pieChartItem.title = 'Unknown';
				pieChartItem.valueUSD = 0;
			}

			pieChartItem.subTitle = token.symbol;

			pieChartItems.push(pieChartItem);
		});

		let ethPrice = SqlLiteService.getTokenPriceBySymbol('ETH');
		pieChartItems.unshift({
			subTitle: 'ETH',
			title: 'Ethereum',
			valueUSD: wallet.getBalanceInUSD(),
			amount: wallet.getFormattedBalance()
		});

		return pieChartItems;
	};

	$scope.pieChart = {
		totalTitle: 'Total Value USD',
		total: CommonService.numbersAfterComma(wallet.calculateTotalBalanceInUSD(), 2),
		items: $scope.getPieChartItems(),
		callback: {
			onReady: () => {
				// TODO set listenere on balance change here
				pieChartIsReady = true;
				if (wallet.calculateTotalBalanceInUSD() > 0) {
					updatePieChart();
				}
			},
			onItemClick: item => {
				$log.info('clicked', item);
			}
		},
		actions: {}
	};

	function updatePieChart() {
		$scope.pieChart.items = $scope.getPieChartItems();

		$scope.pieChart.total = CommonService.numbersAfterComma(
			wallet.calculateTotalBalanceInUSD(),
			2
		);
		$scope.pieChart.draw();
	}

	/**
	 * update pie chart on balance change
	 */
	$rootScope.$on('balance:change', (event, symbol, value, valueInUsd) => {
		if (pieChartIsReady) {
			updatePieChart();
		}
	});

	$scope.navigateToManageCryptos = () => {
		$state.go('member.wallet.manage-cryptos');
	};

	/**
	 * update pie chart on balance change
	 */
	$rootScope.$on('piechart:reload', event => {
		if (pieChartIsReady) {
			updatePieChart();
		}
	});
}
MemberDashboardMainController.$inject = [
	'$rootScope',
	'$scope',
	'$interval',
	'$log',
	'$q',
	'$timeout',
	'$mdSidenav',
	'$state',
	'$filter',
	'CommonService',
	'RPCService',
	'SqlLiteService',
	'SelfkeyService',
	'Web3Service'
];
module.exports = MemberDashboardMainController;
