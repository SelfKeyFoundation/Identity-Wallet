'use strict';

const Wallet = require('../../../classes/wallet');

function GuestKeystoreCreateStep2Controller(
	$rootScope,
	$scope,
	$log,
	$q,
	$state,
	$stateParams,
	SqlLiteService,
	RPCService,
	CommonService
) {
	'ngInject';

	$log.info('GuestKeystoreCreateStep2Controller', $stateParams);

	$scope.walletCreationPromise = null;
	$scope.passwordStrength = 0;

	$scope.input = {
		password: ''
	};

	$scope.cancel = event => {
		$state.go('guest.welcome');
	};

	$scope.nextStep = event => {
		if ($scope.input.password === $stateParams.thePassword) {
			$scope.walletCreationPromise = createKeystore();

			$scope.walletCreationPromise
				.then(() => {
					$state.go('guest.create.step-3');
				})
				.catch(error => {
					$log.error(error);
					CommonService.showToast('error', 'Error creating wallet');
				});
		} else {
			$scope.isWrongConfirmationPassword = true;
		}
	};

	$scope.previousStep = event => {
		$state.go('guest.create.step-1', { thePassword: $stateParams.thePassword });
	};

	$scope.getPasswordStrengthInfo = () => {
		if (!$scope.input.password || !$scope.input.password.length) {
			return '';
		}

		if ($scope.passwordStrength && $scope.passwordStrength.score) {
			return $scope.passwordStrength.score > 2 ? 'Strong' : 'Weak';
		} else {
			return 'Weak';
		}
	};

	function createKeystore() {
		let defer = $q.defer();

		let promise = RPCService.makeCall('createKeystoreFile', {
			password: $scope.input.password
		});

		promise
			.then(data => {
				$rootScope.wallet = new Wallet(
					data.id,
					data.privateKey,
					data.publicKey,
					data.keystoreFilePath,
					data.profile
				);
				defer.resolve();
			})
			.catch(error => {
				defer.reject(error);
			});

		return defer.promise;
	}
}
GuestKeystoreCreateStep2Controller.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$q',
	'$state',
	'$stateParams',
	'SqlLiteService',
	'RPCService',
	'CommonService'
];
module.exports = GuestKeystoreCreateStep2Controller;
