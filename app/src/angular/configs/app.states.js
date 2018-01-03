'use strict';

import Ico from '../classes/ico.js';

function appStates($urlRouterProvider, $stateProvider, $mdThemingProvider, CONFIG, localStorageServiceProvider) {
    'ngInject'

    localStorageServiceProvider.setPrefix(CONFIG.APP_NAME);

    function checkWallet($rootScope, $q, $state, $interval, ConfigFileService, TokenService, Web3Service) {
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

            // set token prices
            $rootScope.wallet.usdPerUnit = $rootScope.ethUsdPrice;
            $rootScope.primaryToken.usdPerUnit = $rootScope.keyUsdPrice;

            // update balances
            let ethBalancePromise = $rootScope.wallet.loadBalance();
            let keyBalancePromise = $rootScope.primaryToken.loadBalance();

            /**
             * 
             */
            $q.all([ethBalancePromise, keyBalancePromise]).then(() => {
                /**
                 * 
                 */
                $rootScope.balanceWatcherPromise = $interval(() => {
                    if ($rootScope.wallet && $rootScope.wallet.getPublicKeyHex()) {
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



        // process layout
        .state('guest.process', {
            abstract: true,
            views: {
                main: {
                    templateUrl: 'guest/process/layout.html'
                }
            }
        })

        // keystore
        .state('guest.keystore', {
            abstract: true,
            views: {
                main: {
                    templateUrl: 'guest/keystore/layout.html'
                }
            }
        })

        // keystore create
        .state('guest.keystore.create-step-1', {
            url: '/guest/keystore/create-step-1',
            views: {
                main: {
                    templateUrl: 'guest/keystore/create/step-1.html',
                    controller: 'GuestKeystoreCreateStep1Controller'
                }
            }
        })

        .state('guest.keystore.create-step-2', {
            url: '/guest/keystore/create-step-2',
            views: {
                main: {
                    templateUrl: 'guest/keystore/create/step-2.html',
                    controller: 'GuestKeystoreCreateStep2Controller'
                }
            },
            params: {
                thePassword: null
            }
        })

        .state('guest.keystore.create-step-3', {
            url: '/guest/keystore/create-step-3',
            views: {
                main: {
                    templateUrl: 'guest/keystore/create/step-3.html',
                    controller: 'GuestKeystoreCreateStep3Controller'
                }
            }
        })

        .state('guest.keystore.create-step-4', {
            url: '/guest/keystore/create-step-4',
            views: {
                main: {
                    templateUrl: 'guest/keystore/create/step-4.html',
                    controller: 'GuestKeystoreCreateStep4Controller'
                }
            }
        })

        .state('guest.process.import-keystore', {
            url: '/guest/process/import-keystore',
            views: {
                main: {
                    templateUrl: 'guest/process/import-keystore.html',
                    controller: 'GuestImportKeystoreController'
                }
            }
        })

        .state('guest.process.unlock-keystore', {
            url: '/guest/process/unlock-keystore',
            views: {
                main: {
                    templateUrl: 'guest/process/unlock-keystore.html',
                    controller: 'GuestUnlockKeystoreController'
                }
            },
            resolve: {
                checkWallet: checkWallet
            }
        })

        .state('guest.process.view-keystore', {
            url: '/guest/process/view-keystore',
            views: {
                main: {
                    templateUrl: 'guest/process/view-keystore.html',
                    controller: 'GuestViewKeystoreController'
                }
            },
            resolve: {
                checkWallet: checkWallet
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
                    templateUrl: 'member/setup/layout.html'
                }
            },
            resolve: {
                checkSetupProgress: ($rootScope, $q, $state, ConfigFileService) => {
                    let defer = $q.defer();

                    $rootScope.initialSetupProgress = {};
                    let isMissing = false;

                    ConfigFileService.load().then(() => {
                        for (let i in $rootScope.INITIAL_ID_ATTRIBUTES) {
                            let attr = $rootScope.INITIAL_ID_ATTRIBUTES[i];

                            let item = ConfigFileService.findIdAttributeItemByKeyAndId(attr.attributeType, attr.id);

                            if (!item.value && !item.path) {
                                isMissing = true;
                            }

                            if (item && !$rootScope.initialSetupProgress[attr.attributeType]) {
                                $rootScope.initialSetupProgress[attr.attributeType] = {};
                                $rootScope.initialSetupProgress[attr.attributeType][attr.id] = item;
                            } else if (item) {
                                $rootScope.initialSetupProgress[attr.attributeType][attr.id] = item;
                            }
                        }

                        if (isMissing) {
                            defer.resolve();
                        } else {
                            $state.go('member.dashboard.main');
                        }
                    }).catch(() => {
                        defer.reject();
                    });

                    return defer.promise;
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

        .state('member.setup.step-1', {
            url: '/member/setup/step-1',
            views: {
                main: {
                    templateUrl: 'member/setup/step-1.html',
                    controller: 'MemberSetupStep1Controller'
                },
            },
            params: {
                skipStep2: false
            }
        })

        .state('member.setup.step-2', {
            url: '/member/setup/step-2',
            views: {
                main: {
                    templateUrl: 'member/setup/step-2.html',
                    controller: 'MemberSetupStep2Controller'
                }
            }
        })

        .state('member.setup.step-3', {
            url: '/member/setup/step-3',
            views: {
                main: {
                    templateUrl: 'member/setup/step-3.html',
                    controller: 'MemberSetupStep3Controller'
                }
            },
            params: {
                step: null
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

        .state('member.setup.wallet-setup', {
            url: '/member/setup/wallet-setup',
            views: {
                main: {
                    templateUrl: 'member/setup/wallet-setup.html'
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

        .state('member.marketplace.main', {
            url: '/member/marketplace/main',
            views: {
                main: {
                    templateUrl: 'member/marketplace/main.html'
                }
            }
        })

        .state('member.marketplace.ico-list', {
            url: '/member/marketplace/ico/list',
            views: {
                main: {
                    templateUrl: 'member/marketplace/ico/list.html',
                    controller: 'MemberMarketplaceIcoListController'
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

        .state('member.marketplace.ico-manage-requirements', {
            url: '/member/marketplace/ico/ico-manage-requirements',
            views: {
                main: {
                    templateUrl: 'member/marketplace/ico/manage-requirements.html',
                    controller: 'MemberMarketplaceIcoManageRequirementsController'
                }
            },
            params: {
                selected: null,
                kycProgress: null,
                allIdAttributes: null,
                kycInfo: null
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

        .state('member.wallet.main', {
            url: '/member/wallet/main',
            views: {
                main: {
                    templateUrl: 'member/wallet/main.html',
                    controller: 'MemberWalletMainController'
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

    //$urlRouterProvider.otherwise('/member/wallet/main');
    //$urlRouterProvider.otherwise('/member/setup/completed');
}

export default appStates;