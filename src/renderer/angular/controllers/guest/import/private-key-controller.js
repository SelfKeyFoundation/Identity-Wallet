'use strict';

const Wallet = require('../../../classes/wallet');

function GuestImportPrivateKeyController(
	$rootScope,
	$scope,
	$log,
	$q,
	$timeout,
	$state,
	RPCService,
	CommonService,
	SqlLiteService
) {
	'ngInject';

	$log.info('GuestImportPrivateKeyController');
	$rootScope.wallet = null;

	$scope.userInput = {
		privateKey: null
	};

	$scope.$watch('userInput.privateKey', (newVal, oldVal) => {
		$scope.theForm.privateKey.$setValidity('badPrivateKey', true);
	});

	$scope.isUnlocking = false;

	$scope.unlock = (event, theForm) => {
		if (!theForm.$valid) return;

		let privateKey = $scope.userInput.privateKey;
		if (!privateKey) {
			return;
		}

		$scope.isUnlocking = true;

		if (!$scope.userInput.privateKey.startsWith('0x')) {
			privateKey = '0x' + $scope.userInput.privateKey;
		}

		let importPromise = RPCService.makeCall('importPrivateKey', { privateKey: privateKey });
		importPromise
			.then(data => {
				if (data.id) {
					$rootScope.wallet = new Wallet(
						data.id,
						data.privateKey,
						data.publicKey,
						null,
						data.profile
					);

					let initialPromises = [];
					initialPromises.push($rootScope.wallet.loadIdAttributes());
					initialPromises.push($rootScope.wallet.loadTokens());

					$q.all(initialPromises)
						.then(resp => {
							$state.go('member.dashboard.main');
						})
						.catch(error => {
							CommonService.showToast('error', error, 5000);
						});
				} else {
					CommonService.showToast('error', 'no data id');
				}
			})
			.catch(error => {
				$log.error(error);
				theForm.privateKey.$setValidity('badPrivateKey', false);
				$scope.isUnlocking = false;
			});
	};
}
GuestImportPrivateKeyController.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$q',
	'$timeout',
	'$state',
	'RPCService',
	'CommonService',
	'SqlLiteService'
];
module.exports = GuestImportPrivateKeyController;
