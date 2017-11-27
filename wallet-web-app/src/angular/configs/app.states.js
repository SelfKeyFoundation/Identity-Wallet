'use strict';

function appStates ($urlRouterProvider, $stateProvider, $mdThemingProvider, CONFIG, localStorageServiceProvider) {
    'ngInject'

    localStorageServiceProvider.setPrefix(CONFIG.APP_NAME);

    //$mdThemingProvider.generateThemesOnDemand(true);
    //$mdTheming.generateTheme('default');

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
                templateUrl: 'guest/process/create-keystore.html'
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
                templateUrl: 'member/main-layout.html',
                controller: 'MemberLayoutController'
            }
        },
        resolve: {
            /*indexedDB: ($rootScope, $q) => {
                let defer = $q.defer();
                
                $rootScope.$on('indexed-db:ready', () => {
                    defer.resolve();
                });
    
                return defer.promise;
            },*/
            configStorage: ($rootScope, $q, ConfigStorageService) => {
                return ConfigStorageService.load();
            }
        }
    })

    /**
     * setup
     */
    .state('member.setup', {
        abstract: true,
        views: {
            main: {
                templateUrl: 'member/setup-layout.html'
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
     * Identity
     */
    .state('member.identity', {
        abstract: true,
        views: {
            main: {
                templateUrl: 'member/identity/layout.html',
                controller: 'MemberIdentityMainController'
            }
        }
    })

    .state('member.identity.main', {
        url: '/member/identity/main',
        views: {
            main: {
                templateUrl: 'member/identity/main.html'
            }
        }
    })

    /**
     * Profile Individual
     */
    .state('member.profile-individual', {
        abstract: true,
        views: {
            main: {
                templateUrl: 'member/profile/individual-layout.html'
            }
        }
    })

    .state('member.profile-individual.main', {
        url: '/member/profile/individual/main',
        views: {
            main: {
                templateUrl: 'member/profile/individual/main.html'
            }
        }
    })

    /**
     * Profile Company
     */
    .state('member.profile-company', {
        abstract: true,
        views: {
            main: {
                templateUrl: 'member/profile/company-layout.html'
            }
        }
    })

    .state('member.profile-company.main', {
        url: '/member/profile/company/main/:companyId',
        views: {
            main: {
                templateUrl: 'member/profile/company/main.html'
            }
        }
    })

    /**
     * marketplace
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

    /**
     * keychain
     */
    .state('member.keychain', {
        abstract: true,
        views: {
            main: {
                templateUrl: 'member/keychain/layout.html'
            }
        }
    })

    .state('member.keychain.main', {
        url: '/member/keychain/main',
        views: {
            main: {
                templateUrl: 'member/keychain/main.html'
            }
        }
    })

    /**
     * 
     */
    .state('member.settings', {
        abstract: true,
        views: {
            main: {
                templateUrl: 'member/settings/layout.html'
            }
        }
    })

    .state('member.settings.main', {
        url: '/member/settings/main',
        views: {
            main: {
                templateUrl: 'member/settings/main.html',
                controller: "MemberSettingsMainController"
            }
        }
    })


    //$urlRouterProvider.otherwise('/member/identity/main');
    $urlRouterProvider.otherwise('/guest/loading');
    //$urlRouterProvider.otherwise('/guest/process/create-keystore');
    
}

export default appStates;