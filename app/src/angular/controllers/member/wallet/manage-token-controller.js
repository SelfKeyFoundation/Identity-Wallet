function ManageTokenController(
	$rootScope,
	$scope,
	$state,
	$log,
	$mdDialog,
	$stateParams,
	TokenService,
	Web3Service,
	CommonService,
	ConfigFileService,
	WalletService
) {
	"ngInject";

	$log.info("ManageTokenController", $stateParams);

	let temporaryMap = {
		key: "Selfkey",
		eth: "Ethereum"
	};

	$scope.selectedToken = TokenService.getBySymbol($stateParams.id.toUpperCase());

	$scope.publicKeyHex = "0x" + $rootScope.wallet.getPublicKeyHex();
	$scope.symbol = $stateParams.id.toUpperCase();
	$scope.originalSymbol = $stateParams.id;
	$scope.name = temporaryMap[$scope.symbol];

	$scope.balance = 0;
	$scope.balanceUsd = 0;

	$rootScope.walletActivityStatuses = $rootScope.walletActivityStatuses || {};

	/**
	 *
	 */
	prepareBalance();

	/**
	 *
	 */
	function prepareBalance() {
		if ($scope.symbol === "ETH") {
			// ETHER
			$scope.balance = Number($rootScope.wallet.balanceEth);
			$scope.balanceUsd = CommonService.numbersAfterComma($rootScope.wallet.balanceInUsd, 2);
		} else {
			// TOKEN
			let promise = $scope.selectedToken.loadBalance();
			promise.then(token => {
				$scope.balance = Number(token.getBalanceDecimal());
				$scope.balanceUsd = CommonService.numbersAfterComma(token.balanceInUsd, 2);
			});
		}
	}

	/**
	 *
	 */
	$scope.setTokenActivity = () => {
		let store = ConfigFileService.getStore();

		let data = store.wallets[$rootScope.wallet.getPublicKeyHex()].data;
		if (data.activities) {
			let activity = data.activities[$scope.originalSymbol];
			let transactions = activity && activity.transactions ? activity.transactions : [];

			transactions.forEach(transaction => {
				if (transaction.to) {
					transaction.nameOfTo = WalletService.getWalletName(
						$scope.originalSymbol,
						transaction.to
					);
				}

				let sendText = transaction.nameOfTo ? "Sent to" : "Sent";
				transaction.sentOrReceive = transaction.to ? sendText : "Received";
			});

			$scope.tokenActivity = transactions;
		}
	};

	$scope.setTokenActivity();

	$scope.goToDashboard = () => {
		$state.go("member.dashboard.main");
	};

	/**
	 * events
	 */
	$rootScope.$on("balance:change", (event, symbol, balance, balanceInUsd) => {
		$log.info("balance:change", symbol, balance, balanceInUsd);
		prepareBalance();
	});
}

module.exports = ManageTokenController;
