'use strict';

const CommonUtils = requireAppModule('angular/classes/common-utils');

function appStates($urlRouterProvider, $stateProvider, $mdThemingProvider, CONFIG, localStorageServiceProvider) {
    'ngInject'

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
            $rootScope.primaryToken = $rootScope.wallet.tokens["KEY"];

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

            $q.all(initialPromises).then((results) => {
                defer.resolve();
            }).catch((error) => {
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
            },
            params: {
                basicInfo: null
            }
        })

        .state('guest.create.step-4', {
            url: '/guest/create/step-4',
            views: {
                main: {
                    templateUrl: 'guest/create/step-4.html',
                    controller: 'GuestKeystoreCreateStep4Controller'
                }
            },
            params: {
                thePassword: null,
                basicInfo: null
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

    $urlRouterProvider.otherwise('/guest/loading');
}

module.exports = appStates;
