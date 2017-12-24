'use strict';

import Ico from '../classes/ico.js';

function appStates($urlRouterProvider, $stateProvider, $mdThemingProvider, CONFIG, localStorageServiceProvider) {
    'ngInject'

    localStorageServiceProvider.setPrefix(CONFIG.APP_NAME);

    //$mdThemingProvider.generateThemesOnDemand(true);
    //$mdTheming.generateTheme('default');

    function checkWallet($rootScope, $q, $state) {
        let defer = $q.defer();

        if (!$rootScope.wallet) {
            $state.go('guest.loading');
            defer.reject();
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

        .state('guest.process.create-keystore', {
            url: '/guest/process/create-keystore',
            views: {
                main: {
                    templateUrl: 'guest/process/create-keystore.html',
                    controller: 'GuestCreateKeystoreController'
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
            }/*,
            resolve: {
                checkWallet: checkWallet
            }*/
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
                            $rootScope.initialSetupProgress[attr] = ConfigFileService.getDefaultIdAttributeItem(attr);

                            if (!$rootScope.initialSetupProgress[attr] || (!$rootScope.initialSetupProgress[attr].value && !$rootScope.initialSetupProgress[attr].path)) {
                                isMissing = true;
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
            url: '/member/setup/step-3/:step',
            views: {
                main: {
                    templateUrl: 'member/setup/step-3.html',
                    controller: 'MemberSetupStep3Controller'
                }
            }
        })

        .state('member.setup.completed', {
            url: '/member/setup/completed',
            views: {
                main: {
                    templateUrl: 'member/setup/completed.html'
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