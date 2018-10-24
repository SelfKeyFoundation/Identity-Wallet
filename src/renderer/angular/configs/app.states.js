/* global appName */
'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('app.states');
function appStates(
	$urlRouterProvider,
	$stateProvider,
	$mdThemingProvider,
	CONFIG,
	localStorageServiceProvider
) {
	'ngInject';

	localStorageServiceProvider.setPrefix(appName);

	function checkWallet($rootScope, $q, $state, $interval, Web3Service) {
		let defer = $q.defer();

		if (!$rootScope.wallet || !$rootScope.wallet.getPublicKeyHex()) {
			$state.go('guest.loading');
			defer.reject();
		} else {
			/**
			 * set primary token
			 */
			$rootScope.primaryToken = $rootScope.wallet.tokens[$rootScope.PRIMARY_TOKEN];

			let initialPromises = [];

			/**
			 * check eth promise
			 */
			initialPromises.push($rootScope.wallet.initialBalancePromise);

			/**
			 * check tokens promise
			 */
			for (let i in $rootScope.wallet.tokens) {
				initialPromises.push($rootScope.wallet.tokens[i].initialBalancePromise);
			}

			$q.all(initialPromises)
				.then(results => {
					defer.resolve();
				})
				.catch(error => {
					log.error(error);
					$state.go('guest.error.offline');
					defer.reject();
				});
		}

		return defer.promise;
	}

	checkWallet.$inject = ['$rootScope', '$q', '$state', '$interval', 'Web3Service'];

	/**
	 * Guest
	 */
	$stateProvider

		.state('guest', {
			abstract: true,
			views: {
				main: {
					templateUrl: 'guest/layout.html',
					controller: 'GuestLayoutController'
				}
			}
		})

		.state('guest.loading', {
			url: '/guest/loading',
			views: {
				main: {
					templateUrl: 'guest/loading.html',
					controller: 'GuestLoadingController'
				}
			},
			params: {
				redirectTo: null
			}
		})

		.state('guest.welcome', {
			url: '/guest/welcome',
			views: {
				main: {
					templateUrl: 'guest/welcome.html' // Create Wallet | Import Wallet
				}
			}
		})

		/**
		 * create
		 */
		.state('guest.create', {
			abstract: true,
			views: {
				main: {
					templateUrl: 'guest/create/layout.html'
				}
			}
		})

		.state('guest.create.step-1', {
			url: '/guest/create/step-1',
			views: {
				main: {
					templateUrl: 'guest/create/step-1.html',
					controller: 'GuestKeystoreCreateStep1Controller'
				}
			},
			params: {
				thePassword: null // stands for recover reason after clicking 'back' btn from confirm pass
			}
		})

		.state('guest.create.step-2', {
			url: '/guest/create/step-2',
			views: {
				main: {
					templateUrl: 'guest/create/step-2.html',
					controller: 'GuestKeystoreCreateStep2Controller'
				}
			},
			params: {
				thePassword: null
			}
		})

		.state('guest.create.step-3', {
			url: '/guest/create/step-3',
			views: {
				main: {
					templateUrl: 'guest/create/step-3.html',
					controller: 'GuestKeystoreCreateStep3Controller'
				}
			},
			params: {
				walletData: null
			}
		})

		.state('guest.create.step-4', {
			url: '/guest/create/step-4',
			views: {
				main: {
					templateUrl: 'guest/create/step-4.html',
					controller: 'GuestKeystoreCreateStep4Controller'
				}
			}
		})

		.state('guest.create.step-5', {
			url: '/guest/create/step-5',
			views: {
				main: {
					templateUrl: 'guest/create/step-5.html',
					controller: 'GuestKeystoreCreateStep5Controller'
				}
			}
		})

		.state('guest.create.step-6', {
			url: '/guest/create/step-6',
			views: {
				main: {
					templateUrl: 'guest/create/step-6.html',
					controller: 'GuestKeystoreCreateStep6Controller'
				}
			},
			params: {
				type: null
			}
		})

		/**
		 * import
		 */
		.state('guest.import', {
			abstract: true,
			views: {
				main: {
					templateUrl: 'guest/import/layout.html',
					controller: 'GuestImportWalletController'
				}
			}
		})

		.state('guest.import.keystore', {
			url: '/guest/import/keystore/:type',
			views: {
				main: {
					templateUrl: 'guest/import/keystore/main.html',
					controller: 'GuestImportKeystoreController'
				}
			}
		})

		.state('guest.import.private-key', {
			url: '/guest/import/private-key',
			views: {
				main: {
					templateUrl: 'guest/import/private-key/main.html',
					controller: 'GuestImportPrivateKeyController'
				}
			}
		})
		.state('guest.import.ledger', {
			url: '/guest/import/ledger',
			views: {
				main: {
					templateUrl: 'guest/import/ledger/main.html'
				}
			}
		})
		.state('guest.import.trezor', {
			url: '/guest/import/trezor',
			views: {
				main: {
					templateUrl: 'guest/import/trezor/main.html'
				}
			}
		})

		/**
		 * Member
		 */
		.state('member', {
			abstract: true,
			views: {
				main: {
					templateUrl: 'member/layout.html',
					controller: 'MemberLayoutController'
				}
			},
			resolve: {
				checkWallet: checkWallet
			}
		})

		/**
		 * setup
		 */
		.state('member.setup', {
			abstract: true,
			views: {
				main: {
					templateUrl: 'member/setup/layout.html',
					controller: 'MemberSetupLayoutController'
				}
			}
		})

		.state('member.setup.checklist', {
			url: '/member/setup/checklist',
			views: {
				main: {
					templateUrl: 'member/setup/checklist.html',
					controller: 'MemberSetupChecklistController'
				}
			}
		})

		.state('member.setup.add-document', {
			url: '/member/setup/add-document',
			views: {
				main: {
					templateUrl: 'member/setup/add-document.html',
					controller: 'MemberSetupAddDocumentController'
				}
			},
			params: {
				type: null
			}
		})

		/**
		 * Dashboard
		 */
		.state('member.dashboard', {
			abstract: true,
			views: {
				main: {
					templateUrl: 'member/dashboard/layout.html'
				}
			}
		})

		.state('member.dashboard.main', {
			url: '/member/dashboard/main',
			views: {
				main: {
					templateUrl: 'member/dashboard/main.html',
					controller: 'MemberDashboardMainController'
				}
			}
		})

		/**
		 * Wallet (TODO rename to token)
		 * member.token
		 * member.token.manage
		 */
		.state('member.wallet', {
			abstract: true,
			views: {
				main: {
					templateUrl: 'member/wallet/layout.html'
				}
			}
		})

		.state('member.wallet.manage-token', {
			url: '/member/wallet/token/:id/manage',
			views: {
				main: {
					templateUrl: 'member/wallet/manage-token.html',
					controller: 'ManageTokenController'
				}
			}
		})

		.state('member.wallet.manage-cryptos', {
			url: '/member/wallet/manage-cryptos',
			views: {
				main: {
					templateUrl: 'member/wallet/manage-cryptos.html',
					controller: 'ManageCryptosController'
				}
			}
		})

		.state('member.wallet.send-token', {
			url: '/member/wallet/send-token',
			views: {
				main: {
					templateUrl: 'common/dialogs/send-token.html',
					controller: 'SendTokenDialogController'
				}
			},
			params: {
				symbol: null,
				allowSelectERC20Token: null
			}
		})

		.state('member.wallet.send-transaction', {
			abstract: true,
			views: {
				main: {
					templateUrl: 'common/dialogs/transaction-layout.html'
				}
			}
		})

		.state('member.wallet.send-transaction.main', {
			url: '/member/wallet/send-transaction/main',
			views: {
				main: {
					templateUrl: 'common/dialogs/send-transaction.html',
					controller: 'SendTransactionController'
				}
			},
			params: {
				symbol: null,
				allowSelectERC20Token: null
			}
		})

		.state('member.wallet.send-transaction.progress', {
			url: '/member/wallet/send-transaction/progress',
			views: {
				main: {
					templateUrl: 'common/dialogs/send-transaction-progress.html',
					controller: 'SendTransactionProgressController'
				}
			},
			params: {
				symbol: null,
				allowSelectERC20Token: null
			}
		})

		.state('member.wallet.send-transaction.no-gas', {
			url: '/member/wallet/send-transaction/no-gas',
			views: {
				main: {
					templateUrl: 'common/dialogs/send-transaction-fealure-no-gas.html',
					controller: 'SendTransactionFailureController'
				}
			},
			params: {
				publicKey: null,
				symbol: null
			}
		})
		.state('member.wallet.send-transaction.error', {
			url: '/member/wallet/send-transaction/error',
			views: {
				main: {
					templateUrl: 'common/dialogs/send-transaction-fealure.html',
					controller: 'SendTransactionFailureController'
				}
			},
			params: {
				publicKey: null,
				symbol: null,
				message: null
			}
		})

		/**
		 * ID Wallet
		 */
		.state('member.id-wallet', {
			abstract: true,
			views: {
				main: {
					templateUrl: 'member/id-wallet/layout.html'
				}
			}
		})

		.state('member.id-wallet.main', {
			url: '/member/id-wallet/main',
			views: {
				main: {
					templateUrl: 'member/id-wallet/main.html',
					controller: 'MemberIdWalletMainController'
				}
			}
		})

		/**
		 *  Address book
		 */
		.state('member.address-book', {
			abstract: true,
			views: {
				main: {
					templateUrl: 'member/address-book/layout.html'
				}
			}
		})

		.state('member.address-book.main', {
			url: '/member/address-book/main',
			views: {
				main: {
					templateUrl: 'member/address-book/main.html',
					controller: 'AddressBookMainController'
				}
			}
		})

		.state('member.address-book.add', {
			url: '/member/address-book/add',
			views: {
				main: {
					templateUrl: 'member/address-book/add.html',
					controller: 'AddressBookAddController'
				}
			}
		})

		.state('member.address-book.edit', {
			url: '/member/address-book/edit',
			views: {
				main: {
					templateUrl: 'member/address-book/edit.html',
					controller: 'AddressBookEditController'
				}
			},
			params: {
				data: {}
			}
		})

		/**
		 *  Marketplace
		 */
		.state('member.marketplace', {
			abstract: true,
			views: {
				main: {
					templateUrl: 'member/marketplace/layout.html'
				}
			}
		})

		.state('member.marketplace.main', {
			url: '/member/marketplace/main',
			views: {
				main: {
					templateUrl: 'member/marketplace/marketplace.html',
					controller: 'MemberMarketplaceController'
				}
			}
		})

		.state('member.marketplace.exchange-list', {
			url: '/member/marketplace/exchange-list',
			views: {
				main: {
					templateUrl: 'member/marketplace/exchange-list.html',
					controller: 'MemberMarketplaceExchangeListController'
				}
			}
		})
		.state('member.marketplace.exchange-item', {
			url: '/member/marketplace/exchange-item',
			views: {
				main: {
					templateUrl: 'member/marketplace/exchange-item.html',
					controller: 'MemberMarketplaceExchangeItemController'
				}
			},
			params: {
				data: {}
			}
		})
		.state('member.marketplace.no-balance', {
			url: '/member/marketplace/no-balance',
			views: {
				main: {
					templateUrl: 'member/marketplace/no-balance.html',
					controller: 'MemberMarketplaceNoBalanceController'
				}
			},
			params: {
				data: {}
			}
		})
		.state('member.marketplace.unlock', {
			url: '/member/marketplace/unlock',
			views: {
				main: {
					templateUrl: 'member/marketplace/unlock.html',
					controller: 'MemberMarketplaceUnlockController'
				}
			},
			params: {
				data: {}
			}
		})
		.state('member.marketplace.return', {
			url: '/member/marketplace/return',
			views: {
				main: {
					templateUrl: 'member/marketplace/return.html',
					controller: 'MemberMarketplaceReturnController'
				}
			},
			params: {
				data: {}
			}
		})
		.state('member.marketplace.progress', {
			url: '/member/marketplace/progress',
			views: {
				main: {
					templateUrl: 'member/marketplace/unlock-progress.html',
					controller: 'MemberMarketplaceUnlockProgressController'
				}
			},
			params: {
				data: {}
			}
		});

	$urlRouterProvider.otherwise('/guest/loading');
}

appStates.$inject = [
	'$urlRouterProvider',
	'$stateProvider',
	'$mdThemingProvider',
	'CONFIG',
	'localStorageServiceProvider'
];

module.exports = appStates;
