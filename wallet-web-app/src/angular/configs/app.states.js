'use strict';

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
                    templateUrl: 'member/dashboard/main.html'
                }
            }
        })

    //$urlRouterProvider.otherwise('/member/identity/main');
    $urlRouterProvider.otherwise('/guest/loading');
    //$urlRouterProvider.otherwise('/guest/process/create-keystore');

    //$urlRouterProvider.otherwise('/member/dashboard/main');
}

export default appStates;