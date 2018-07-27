'use strict';
const { Logger } = require('common/logger');
const log = new Logger('choose-ledger-addr-ctl');
const Wallet = require('../../../classes/wallet');

function ChooseHardwareWalletAddressController(
	$rootScope,
	$scope,
	$q,
	$state,
	$mdDialog,
	CommonService,
	HardwareWalletService,
	baseAccounts,
	ACCOUNTS_QUANTITY_PER_PAGE,
	profile
) {
	'ngInject';
	$scope.currentAccounts = baseAccounts;
	$scope.selectedAccount = null;
	$scope.pagerStart = 0;
	$scope.title = profile === 'ledger' ? 'Choose A Ledger Address' : 'Choose A TREZOR Address';

	$scope.cancel = () => {
		$mdDialog.cancel();
	};

	let onError = err => {
		let errMessage;
		if (+err.statusCode === 26625) {
			errMessage = 'Ledger has timed out and must be unlocked again with PIN';
		}
		CommonService.showToast('error', errMessage || 'Device not found');
	};

	let resetLoadingStatuses = () => {
		$scope.loadingBalancesIsInProgress = {
			next: false,
			previous: false,
			any: false
		};
	};

	resetLoadingStatuses();
	$scope.getAccountsWithBalances = isNext => {
		if ($scope.loadingBalancesIsInProgress.any) {
			return;
		}

		$scope.loadingBalancesIsInProgress.any = true;
		if (isNext) {
			$scope.loadingBalancesIsInProgress.next = true;
		} else {
			$scope.loadingBalancesIsInProgress.previous = true;
		}

		let newStart = isNext
			? $scope.pagerStart + ACCOUNTS_QUANTITY_PER_PAGE
			: $scope.pagerStart - ACCOUNTS_QUANTITY_PER_PAGE;
		if (newStart < 0) {
			newStart = 0;
		}
		HardwareWalletService.getAccountsWithBalances({
			start: newStart,
			quantity: ACCOUNTS_QUANTITY_PER_PAGE,
			profile
		})
			.then(accounts => {
				accounts = accounts || [];
				$scope.currentAccounts = accounts;
				$scope.selectedAccount = null;
				$scope.pagerStart = newStart;
				resetLoadingStatuses();
			})
			.catch(err => {
				resetLoadingStatuses();
				onError(err);
			});
	};

	let nextStep = isSetupFinished => {
		$scope.cancel();
		if (isSetupFinished) {
			$state.go('member.dashboard.main');
		} else {
			$state.go('guest.loading', { redirectTo: 'guest.create.step-5' });
		}
	};

	$scope.chooseAccount = () => {
		let selectedAccount = $scope.selectedAccount;
		if (!selectedAccount) {
			return;
		}

		let address = selectedAccount.address;
		if (address.substring(0, 2) === '0x') {
			address = address.substring(2, address.length);
		}

		if (profile === 'trezor') {
			$rootScope.selectedTrezorAccountIndex = selectedAccount.index;
		}

		let importPromise = HardwareWalletService.createWalletByAddress(address, profile);
		importPromise
			.then(data => {
				if (data.id) {
					$rootScope.wallet = new Wallet(
						data.id,
						null,
						data.publicKey,
						null,
						data.profile
					);

					let initialPromises = [];
					initialPromises.push($rootScope.wallet.loadIdAttributes());
					initialPromises.push($rootScope.wallet.loadTokens());

					$q.all(initialPromises)
						.then(resp => {
							$rootScope.selectedLedgerAccount = selectedAccount;
							nextStep(data.isSetupFinished);
						})
						.catch(error => {
							log.error(error);
							CommonService.showToast('error', 'error');
						});
				} else {
					CommonService.showToast('error', 'error');
				}
			})
			.catch(error => {
				log.error(error);
				CommonService.showToast('error', 'error');
			});
	};
}

ChooseHardwareWalletAddressController.$inject = [
	'$rootScope',
	'$scope',
	'$q',
	'$state',
	'$mdDialog',
	'CommonService',
	'HardwareWalletService',
	'baseAccounts',
	'ACCOUNTS_QUANTITY_PER_PAGE',
	'profile'
];
module.exports = ChooseHardwareWalletAddressController;
