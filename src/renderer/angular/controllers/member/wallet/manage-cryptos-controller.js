'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('ManageCryptosController');
function ManageCryptosController(
	$rootScope,
	$scope,
	$q,
	$timeout,
	$mdDialog,
	$state,
	$interval,
	SqlLiteService,
	Web3Service,
	CommonService
) {
	'ngInject';

	log.info('ManageCryptosController');

	let reloadPieChartIsNeeded = false;
	let processTokensInterval = null;
	$scope.cancel = event => {
		$state.go('member.dashboard.main');
		if (reloadPieChartIsNeeded) {
			$rootScope.$broadcast('piechart:reload');
		}
	};

	$scope.data = [];
	let wallet = $rootScope.wallet;

	let processTokens = walletTokens => {
		let data = Object.keys(walletTokens).map(tokenKey => {
			let walletToken = walletTokens[tokenKey];

			walletToken.totalValue = Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD'
			}).format(walletToken.calculateBalanceInUSD());

			let lastPrice = SqlLiteService.getTokenPriceBySymbol(walletToken.symbol.toUpperCase());
			walletToken.lastPrice = Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD'
			}).format(lastPrice ? lastPrice.priceUSD : 0);
			walletToken.balance = Intl.NumberFormat('en-US').format(
				Number(walletToken.getBalanceDecimal()).toFixed(2)
			);

			walletToken.name = lastPrice ? lastPrice.name : '';

			return walletToken;
		});

		let ethPrice = SqlLiteService.getTokenPriceBySymbol('ETH');
		data.push({
			symbol: 'ETH',
			name: 'Ethereum',
			lastPrice: Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD'
			}).format(ethPrice ? ethPrice.priceUSD : 0),
			balance: Intl.NumberFormat('en-US').format(
				Number(wallet.getFormattedBalance()).toFixed(2)
			),
			totalValue: Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD'
			}).format(wallet.calculateBalanceInUSD()),
			contractAddress: ''
		});
		data.sort((a, b) => {
			let symbolA = a.symbol.toLowerCase();
			let symbolB = b.symbol.toLowerCase();
			if (symbolA === 'eth') {
				return -1;
			}

			if (symbolB === 'eth') {
				return 1;
			}

			if (symbolA === $rootScope.PRIMARY_TOKEN.toLowerCase()) {
				return -1;
			}

			if (symbolB === $rootScope.PRIMARY_TOKEN.toLowerCase()) {
				return 1;
			}

			return parseFloat(b.totalValue || 0) - parseFloat(a.totalValue || 0);
		});

		$scope.data = data;
	};

	processTokens(wallet.tokens);

	processTokensInterval = $interval(() => {
		processTokens(wallet.tokens);
	}, 3000);

	$rootScope.$on('$destroy', () => {
		if (processTokensInterval) {
			$interval.cancel(processTokensInterval);
		}
	});

	const PRIMARY_TOKEN_KEYS = [$rootScope.PRIMARY_TOKEN.toUpperCase(), 'ETH'];
	$scope.isDeletable = token => {
		if (PRIMARY_TOKEN_KEYS.indexOf(token.symbol.toUpperCase()) !== -1) {
			return false;
		}
		return true;
	};

	$scope.toggleCustomToken = (event, token) => {
		const shouldHide = !token.hidden;
		if (shouldHide) {
			$rootScope
				.openConfirmationDialog(
					event,
					'Hiding tokens from this list only disables them from the display, and does not impact their status on the Ethereum blockchain.\n',
					'Are you sure?'
				)
				.then(val => {
					if (val === 'accept') {
						toggleTokenHide(shouldHide, token);
					}
				});
		} else {
			toggleTokenHide(shouldHide, token);
		}
	};

	const toggleTokenHide = (shouldHide, token) => {
		SqlLiteService.updateWalletToken({
			id: token.id,
			hidden: shouldHide ? 1 : 0
		}).catch(error => {
			log.error(JSON.stringify(error));
		});
	};

	$scope.deleteCustomToken = (event, token, index) => {
		$rootScope
			.openConfirmationDialog(
				event,
				'Hiding tokens from this list only disables them from the display, and does not impact their status on the Ethereum blockchain.\n',
				'Are you sure?'
			)
			.then(val => {
				if (val === 'accept') {
					SqlLiteService.updateWalletToken({
						tokenId: token.id,
						walletId: wallet.id,
						id: token.walletTokenId,
						balance: token.balance,
						recordState: 0
					}).then(() => {
						delete $rootScope.wallet.tokens[token.symbol.toUpperCase()];
						$scope.data.splice(index, 1);
						reloadPieChartIsNeeded = true;
					});
				}
			});
	};

	$rootScope.$on('token:added', event => {
		processTokens(wallet.tokens);
	});
}
ManageCryptosController.$inject = [
	'$rootScope',
	'$scope',
	'$q',
	'$timeout',
	'$mdDialog',
	'$state',
	'$interval',
	'SqlLiteService',
	'Web3Service',
	'CommonService'
];
module.exports = ManageCryptosController;
