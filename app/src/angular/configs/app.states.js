'use strict';

const CommonUtils = requireAppModule('angular/classes/common-utils');

function appStates($urlRouterProvider, $stateProvider, $mdThemingProvider, CONFIG, localStorageServiceProvider) {
    'ngInject'

    localStorageServiceProvider.setPrefix(appName);

    function checkWallet($rootScope, $q, $state, $interval, ConfigFileService, TokenService, Web3Service, SelfkeyService) {
        let defer = $q.defer();

        if (!$rootScope.wallet || !$rootScope.wallet.getPublicKeyHex()) {
            $state.go('guest.loading');
            defer.reject();
        } else {
            /**
             * 
             */
            TokenService.init($rootScope.wallet.getPublicKeyHex());
            $rootScope.primaryToken = TokenService.getBySymbol($rootScope.PRIMARY_TOKEN.toUpperCase());

            // 1) TODO - get prices

            // set token prices (TODO)
            $rootScope.wallet.usdPerUnit = $rootScope.ethUsdPrice || 900;
            $rootScope.primaryToken.usdPerUnit = $rootScope.keyUsdPrice || 0.02;

            // update balances
            let ethBalancePromise = $rootScope.wallet.loadBalance();
            let keyBalancePromise = $rootScope.primaryToken.loadBalance();

            let loadPricesPromise = SelfkeyService.getPrices(["ETH", "KEY"]);

            /**
             * 
             */
            $q.all([loadPricesPromise, ethBalancePromise, keyBalancePromise]).then(() => {
                if ($rootScope.PRICES["ETH"]) {
                    $rootScope.wallet.usdPerUnit = $rootScope.PRICES["ETH"].priceUsd;
                }

                if ($rootScope.PRICES["KEY"]) {
                    $rootScope.primaryToken.usdPerUnit = $rootScope.PRICES["KEY"].priceUsd;
                }

                /**
                 * 
                 */
                $rootScope.balanceWatcherPromise = $interval(() => {
                    if ($rootScope.wallet && $rootScope.wallet.getPublicKeyHex()) {
                        SelfkeyService.getPrices(["ETH", "KEY"]).then((resp) => {
                            if ($rootScope.PRICES["ETH"]) {
                                $rootScope.wallet.usdPerUnit = $rootScope.PRICES["ETH"].priceUsd;
                            }

                            if ($rootScope.PRICES["KEY"]) {
                                $rootScope.primaryToken.usdPerUnit = $rootScope.PRICES["KEY"].priceUsd;
                            }
                        });
                        $rootScope.wallet.loadBalance();
                        $rootScope.primaryToken.loadBalance();
                    }
                }, 10000); // TODO - take interval from config

                defer.resolve();
            }).catch(() => {
                $state.go('guest.error.offline');
                defer.reject();
            });
        }

        return defer.promise;
    }

    function checkKyc($rootScope, $q, $state, ConfigFileService, TokenService, Web3Service, checkWallet) {
        let defer = $q.defer();

        let store = ConfigFileService.getStore();

        /**
         * 
         */
        let walletStore = store.wallets[$rootScope.wallet.getPublicKeyHex()];

        /**
         * check kyc status
         */
        if (!walletStore.data || !walletStore.data.idAttributes || Object.keys(walletStore.data.idAttributes).length <= 0) {
            $state.go('member.setup.choose');
            defer.resolve();
        } else {
            defer.resolve();
        }

        return defer.promise;
    }

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

    /**
     * keystore
     */
    .state('guest.keystore', {
        abstract: true,
        views: {
            main: {
                templateUrl: 'guest/keystore/layout.html'
            }
        }
    })


    /**
     * 
     */
    .state('guest.process', {
        abstract: true,
        views: {
            main: {
                templateUrl: 'guest/process/layout.html'
            }
        }
    })

    .state('guest.process.view-keystore', {
        url: '/guest/process/view-keystore',
        views: {
            main: {
                templateUrl: 'guest/process/view-keystore.html',
                controller: 'GuestViewKeystoreController'
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
            checkWallet: checkWallet,
            checkKyc: checkKyc
        }
    })

    /**
     * setup
     */
    .state('member.setup', {
        abstract: true,
        views: {
            main: {
                templateUrl: 'member/setup/layout.html'
            }
        }
    })

    .state('member.setup.view-keystore', {
        url: '/member/setup/view-keystore',
        views: {
            main: {
                templateUrl: 'member/setup/view-keystore.html',
                controller: 'MemberSetupViewKeystoreController'
            }
        }
    })

    .state('member.setup.choose', {
        url: '/member/setup/choose',
        views: {
            main: {
                templateUrl: 'member/setup/choose.html',
                controller: 'MemberSetupChooseController'
            }
        }
    })

    .state('member.setup.completed', {
        url: '/member/setup/completed',
        views: {
            main: {
                templateUrl: 'member/setup/completed.html',
                controller: 'MemberSetupCompletedController'
            }
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
     * Marketplace
     */
    .state('member.marketplace', {
        abstract: true,
        views: {
            main: {
                templateUrl: 'member/marketplace/layout.html'
            }
        }
    })

    .state('member.marketplace.ico-item', {
        url: '/member/marketplace/ico/item',
        views: {
            main: {
                templateUrl: 'member/marketplace/ico/item.html',
                controller: 'MemberMarketplaceIcoItemController'
            }
        },
        params: {
            selected: null
        }
    })

    .state('member.marketplace.ico-accept-terms', {
        url: '/member/marketplace/ico/ico-accept-terms',
        views: {
            main: {
                templateUrl: 'member/marketplace/ico/accept-terms.html',
                controller: 'MemberMarketplaceIcoAcceptTermsController'
            }
        },
        params: {
            selected: null
        }
    })

    /**
     * Wallet
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

    $urlRouterProvider.otherwise('/guest/loading');
}

module.exports = appStates;