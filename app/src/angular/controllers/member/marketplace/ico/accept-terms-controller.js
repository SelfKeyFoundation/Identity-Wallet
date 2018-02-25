function MemberMarketplaceIcoAcceptTermsController(
	$rootScope,
	$scope,
	$log,
	$q,
	$timeout,
	$stateParams,
	$sce,
	$mdDialog,
	TokenService,
	ConfigFileService,
	CommonService
) {
	"ngInject";

	$log.info("MemberMarketplaceIcoAcceptTermsController", $stateParams);

	/**
	 * get ico data
	 */
	$scope.ico = $stateParams.selected;

	let token = TokenService.getBySymbol($scope.ico.symbol.toUpperCase());

	$scope.terms = {
		"1": false,
		"2": false,
		"3": false
	};

	$scope.sendEth = event => {
		$log.info($scope.terms, "sendEth");

		$mdDialog.show({
			controller: "SendTokenDialogController",
			templateUrl: "common/dialogs/send-token.html",
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: true,
			escapeToClose: false,
			locals: {
				args: {
					symbol: "eth",
					sendToAddressHex: token.contractAddress,
					isAddressLocked: true,
					isGasPriceLocked: true,
					gasLimit: 210000
				}
			}
		});
	};
}

module.exports = MemberMarketplaceIcoAcceptTermsController;
