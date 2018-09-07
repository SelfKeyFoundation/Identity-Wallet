/* global appName, appVersion, angular */
'use strict';
const Wallet = require('../classes/wallet');
const Token = require('../classes/token');

function AppRun(
	$rootScope,
	$window,
	$timeout,
	$interval,
	$q,
	$state,
	$trace,
	$mdDialog,
	DICTIONARY,
	CONFIG,
	RPCService,
	SqlLiteService,
	Web3Service,
	CommonService,
	SignService
) {
	'ngInject';

	$trace.enable('TRANSITION');

	$rootScope.isDevMode = CONFIG.dev;
	$rootScope.productName = appName;
	$rootScope.version = appVersion;
	$rootScope.selectedLanguage = CONFIG.defaultLanguage;

	/**
	 *
	 */
	$rootScope.INITIAL_ID_ATTRIBUTES = CONFIG.constants.initialIdAttributes;
	$rootScope.LOCAL_STORAGE_KEYS = CONFIG.constants.localStorageKeys;
	$rootScope.PRIMARY_TOKEN = CONFIG.constants.primaryToken;
	$rootScope.DICTIONARY = DICTIONARY[$rootScope.selectedLanguage];

	/**
	 *
	 */
	$rootScope.PRICES = {};

	/**
	 *
	 */
	Wallet.$rootScope = $rootScope;
	Wallet.$interval = $interval;
	Wallet.$q = $q;
	Wallet.Web3Service = Web3Service;
	Wallet.SqlLiteService = SqlLiteService;
	Wallet.CommonService = CommonService;

	Token.$rootScope = $rootScope;
	Token.$q = $q;
	Token.$interval = $interval;
	Token.Web3Service = Web3Service;
	Token.SqlLiteService = SqlLiteService;
	Token.CommonService = CommonService;

	/**
	 *
	 */
	$rootScope.getTranslation = function(prefix, keyword, args) {
		if (prefix) {
			keyword = prefix.toUpperCase() + '_' + keyword.toUpperCase();
		}

		let template = DICTIONARY[$rootScope.selectedLanguage][keyword] || 'translation not found';
		if (args) {
			for (let i = 0; i < args.length; i++) {
				template = template.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
			}
		}
		return template;
	};

	$rootScope.buildErrorObject = (keyword, error) => {
		return {
			message: $rootScope.getTranslation(keyword),
			causedBy: error
		};
	};

	$rootScope.closeApp = event => {
		RPCService.makeCall('closeApp', {});
	};

	$rootScope.openInBrowser = function(url, useInAppBrowser) {
		useInAppBrowser
			? $window.open(url)
			: RPCService.makeCall('openBrowserWindow', { url: url });
	};

	$rootScope.appendStaticPath = function(path) {
		return $window.staticPath + '/' + path;
	};

	$rootScope.openSendTokenDialog = (event, symbol, allowSelectERC20Token) => {
		$state.go('member.wallet.send-token', { symbol, allowSelectERC20Token });
	};

	$rootScope.openSendTransactionDialog = (event, symbol, allowSelectERC20Token) => {
		$state.go('member.wallet.send-transaction', { symbol, allowSelectERC20Token });
	};

	$rootScope.openReceiveTokenDialog = (event, args) => {
		return $mdDialog.show({
			controller: 'ReceiveTokenDialogController',
			templateUrl: 'common/dialogs/receive-token.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: true,
			locals: {
				args: args
			}
		});
	};

	$rootScope.openInfoDialog = (event, text, title) => {
		$mdDialog.show({
			controller: 'InfoDialogController',
			templateUrl: 'common/dialogs/info-dialog.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: false,
			escapeToClose: false,
			locals: {
				text: text,
				title: title
			}
		});
	};

	$rootScope.openNewERC20TokenInfoDialog = (event, title, symbol, balance) => {
		$mdDialog.show({
			controller: 'NewERC20TokenInfoController',
			templateUrl: 'common/dialogs/new-erc20-token-info.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: false,
			escapeToClose: false,
			locals: {
				symbol: symbol,
				title: title,
				balance: balance
			}
		});
	};

	$rootScope.openConfirmationDialog = (event, text, title) => {
		return $mdDialog.show({
			controller: 'ConfirmationDialogController',
			templateUrl: 'common/dialogs/confirmation-dialog.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: false,
			escapeToClose: false,
			locals: {
				text: text,
				title: title
			}
		});
	};

	$rootScope.checkTermsAndConditions = () => {
		let guideSettings = SqlLiteService.getGuideSettings();

		if (!guideSettings.termsAccepted) {
			$timeout(() => {
				$mdDialog
					.show({
						controller: 'TermsDialogController',
						templateUrl: 'common/dialogs/terms.html',
						parent: angular.element(document.body),
						targetEvent: null,
						clickOutsideToClose: false,
						escapeToClose: false,
						fullscreen: true
					})
					.then(() => {
						$mdDialog.show({
							controller: 'StartupGuideDialogController',
							templateUrl: 'common/dialogs/startup-guide.html',
							parent: angular.element(document.body),
							targetEvent: null,
							clickOutsideToClose: false,
							escapeToClose: false,
							fullscreen: true
						});
					});
			}, 300);
		}
	};

	$rootScope.openUpdateDialog = (event, releaseName) => {
		return $mdDialog.show({
			controller: 'UpdateDialogController',
			templateUrl: 'common/dialogs/update.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: true,
			locals: {
				releaseName: releaseName
			}
		});
	};

	$rootScope.openAddEditDocumentDialog = (event, mode, idAttributeType, idAttribute) => {
		return $mdDialog.show({
			controller: 'AddEditDocumentDialogController',
			templateUrl: 'common/dialogs/id-attributes/add-edit-document.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: true,
			locals: {
				mode: mode,
				idAttributeType: idAttributeType,
				idAttribute: idAttribute
			}
		});
	};

	$rootScope.openAddEditStaticDataDialog = (event, mode, itAttributeType, idAttribute) => {
		return $mdDialog.show({
			controller: 'AddEditStaticDataDialogController',
			templateUrl: 'common/dialogs/id-attributes/add-edit-static-data.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: true,
			locals: {
				mode: mode,
				idAttributeType: itAttributeType,
				idAttribute: idAttribute
			}
		});
	};

	$rootScope.openDocumentPreviewDialog = (event, documentId) => {
		return $mdDialog.show({
			controller: 'DocumentPreviewDialogController',
			templateUrl: 'common/dialogs/document-preview.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: true,
			locals: {
				documentId: documentId
			}
		});
	};

	$rootScope.openAddCustomTokenDialog = event => {
		return $mdDialog.show({
			controller: 'AddCustomTokenDialogController',
			templateUrl: 'common/dialogs/add-custom-token.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: true
		});
	};

	$rootScope.openConnectingToLedgerDialog = (event, isSendingTxFealure) => {
		return $mdDialog.show({
			controller: 'ConnectingToHardwareWalletController',
			templateUrl: 'common/dialogs/connecting-to-ledger.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: true,
			locals: {
				isSendingTxFealure,
				profile: 'ledger'
			}
		});
	};

	$rootScope.openConnectingToTrezorDialog = (event, isSendingTxFealure) => {
		return $mdDialog.show({
			controller: 'ConnectingToHardwareWalletController',
			templateUrl: 'common/dialogs/connecting-to-trezor.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			fullscreen: true,
			locals: {
				isSendingTxFealure,
				profile: 'trezor'
			}
		});
	};

	$rootScope.openEnterTrezorPinDialog = event => {
		let result = document.getElementsByClassName('trezor-pin-container')[0];
		if (result) {
			return;
		}

		$rootScope.incorrectTrezorPinEntered = false;

		return $mdDialog.show({
			controller: 'TrezorPinController',
			templateUrl: 'common/dialogs/trezor-pin.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			escapeToClose: false,
			fullscreen: true
		});
	};

	$rootScope.openEnterTrezorPassphraseDialog = event => {
		let result = document.getElementsByClassName('trezor-passphrase-container')[0];
		if (result) {
			return;
		}

		return $mdDialog.show({
			controller: 'TrezorPassphraseController',
			templateUrl: 'common/dialogs/trezor-passphrase.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: false,
			escapeToClose: false,
			fullscreen: true
		});
	};

	$rootScope.openChooseHardwareWalletAddressDialog = (
		accountsArr,
		ACCOUNTS_QUANTITY_PER_PAGE,
		profile
	) => {
		return $mdDialog.show({
			controller: 'ChooseHardwareWalletAddressController',
			templateUrl: 'common/dialogs/choose-hardware-wallet-address.html',
			parent: angular.element(document.body),
			targetEvent: null,
			clickOutsideToClose: false,
			fullscreen: true,
			locals: {
				baseAccounts: accountsArr,
				ACCOUNTS_QUANTITY_PER_PAGE,
				profile
			}
		});
	};

	$rootScope.openRejectHardwareWalletTxWarningDialog = profile => {
		let result = document.getElementsByClassName('send-token')[0];

		return $mdDialog.show({
			controller: [
				'$scope',
				'profile',
				function($scope, profile) {
					$scope.profile = profile;
					$scope.cancel = () => {
						$mdDialog.cancel();
					};
				}
			],
			templateUrl: 'common/dialogs/reject-hardware-wallet-tx-warning.html',
			parent: result ? angular.element(result) : angular.element(document.body),
			targetEvent: null,
			hasBackdrop: false,
			clickOutsideToClose: false,
			fullscreen: false,
			locals: {
				profile
			}
		});
	};

	$rootScope.openConfirmHardwareWalletTxInfoWindow = profile => {
		let result = document.getElementsByClassName('send-token')[0];
		return $mdDialog.show({
			controller: [
				'$scope',
				'profile',
				function($scope, profile) {
					$scope.profile = profile;
					$scope.cancel = () => {
						$mdDialog.cancel();
					};
				}
			],
			templateUrl: 'common/dialogs/confirm-hardware-wallet-tx-info.html',
			parent: result ? angular.element(result) : angular.element(document.body),
			targetEvent: null,
			hasBackdrop: false,
			escapeToClose: false,
			clickOutsideToClose: false,
			fullscreen: true,
			locals: {
				profile
			}
		});
	};

	$rootScope.openUnlockLedgerInfoWindow = () => {
		let result = document.getElementsByClassName('send-token')[0];
		return $mdDialog.show({
			controller: [
				'$scope',
				'$mdDialog',
				function($scope, $mdDialog) {
					$scope.tryAgain = event => {
						$rootScope.broadcastRetryToSign(event);
					};
					$scope.cancel = event => {
						$mdDialog.cancel();
					};
				}
			],
			templateUrl: 'common/dialogs/unlock-ledger-info.html',
			parent: result ? angular.element(result) : angular.element(document.body),
			targetEvent: null,
			hasBackdrop: false,
			escapeToClose: false,
			clickOutsideToClose: false,
			fullscreen: true
		});
	};

	$rootScope.openHardwareWalletTimedOutWindow = profile => {
		let result = document.getElementsByClassName('send-token')[0];
		return $mdDialog.show({
			controller: [
				'$scope',
				'$mdDialog',
				'profile',
				function($scope, $mdDialog, profile) {
					$scope.profile = profile;
					$scope.cancel = event => {
						$mdDialog.cancel();
					};
				}
			],
			templateUrl: 'common/dialogs/hardware-wallet-timed-out.html',
			parent: result ? angular.element(result) : angular.element(document.body),
			targetEvent: null,
			hasBackdrop: false,
			escapeToClose: false,
			clickOutsideToClose: false,
			fullscreen: true,
			locals: {
				profile
			}
		});
	};

	$rootScope.openChooseTrezorAddressPreWindow = () => {
		return $mdDialog.show({
			controller: function() {},
			templateUrl: 'common/dialogs/choose-trezor-address-pre-dialog.html',
			parent: angular.element(document.body),
			targetEvent: null,
			escapeToClose: false,
			clickOutsideToClose: false,
			fullscreen: true
		});
	};

	$rootScope.openInstallTrezorBridgeWarning = () => {
		return $mdDialog.show({
			controller: [
				'$scope',
				function($scope) {
					$scope.downloadUrl = 'https://wallet.trezor.io/#/bridge';
					$scope.cancel = () => {
						$mdDialog.cancel();
					};
				}
			],
			templateUrl: 'common/dialogs/install-trezor-bridge-warning.html',
			parent: angular.element(document.body),
			targetEvent: null,
			hasBackdrop: false,
			clickOutsideToClose: true,
			fullscreen: false
		});
	};

	$rootScope.broadcastRetryToSign = event => {
		$rootScope.$broadcast('tx-sign:retry', event);
	};

	$rootScope.broadcastKeyPress = event => {
		$rootScope.$broadcast('selfkey:on-keypress', event.key);
	};

	$rootScope.broadcastTxHistoryChange = event => {
		$rootScope.$broadcast('tx-history:change', event);
	};

	$rootScope.broadcastTxHistorySync = event => {
		$rootScope.$broadcast('tx-history:sync', event);
	};
}

AppRun.$inject = [
	'$rootScope',
	'$window',
	'$timeout',
	'$interval',
	'$q',
	'$state',
	'$trace',
	'$mdDialog',
	'DICTIONARY',
	'CONFIG',
	'RPCService',
	'SqlLiteService',
	'Web3Service',
	'CommonService',
	'SignService'
];

module.exports = AppRun;
