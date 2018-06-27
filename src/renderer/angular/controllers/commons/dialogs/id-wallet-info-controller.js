'use strict';

function IdWalletInfoController($rootScope, $scope, $log, $mdDialog) {
	'ngInject';

	$scope.cancel = event => {
		$mdDialog.cancel();
	};

	$scope.infoArray = [
		{
			logo: 'selfkey',
			textPart1:
				'The SelfKey ID allows you to manage, own, and control various parts of your identity. Your SelfKey ID is broken down into two parts: attributes and documents. Filling out this information is not required to use the wallet for managing your crypto assets.',
			textPart2:
				'However, if you wish to access products and services in the SelfKey Marketplace, your SelKey ID is required will help make the KYC process easier. All information is stored locally on your device, and not on the server or blockchain. SelfKey does not have access to this information, as it is under your full control.',
			header: 'About Your SelfKey ID',
			button2: 'continue',
			step: 1
		}
	];

	$scope.dialogInfo = $scope.infoArray[0];

	var count = 1;

	$scope.nextStep = function() {
		count++;
		$scope.dialogInfo = $scope.infoArray.find(function(item) {
			if (count == 2) {
				$scope.cancel();
			} else if (item.step == count && count != 2) {
				return item;
			}
		});
	};

	$scope.backStep = function() {
		count--;
		$scope.dialogInfo = $scope.infoArray.find(function(item) {
			if (count == 0) {
				$scope.cancel();
			} else if (item.step == count && count != 0) {
				return item;
			}
		});
	};
}
IdWalletInfoController.$inject = ['$rootScope', '$scope', '$log', '$mdDialog'];
module.exports = IdWalletInfoController;
