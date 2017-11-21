'use strict';

function appStates ($urlRouterProvider, $stateProvider, $mdThemingProvider, CONFIG, localStorageServiceProvider) {
    'ngInject'

    localStorageServiceProvider.setPrefix(CONFIG.APP_NAME);

    //$mdThemingProvider.generateThemesOnDemand(true);
    //$mdTheming.generateTheme('default');

    $stateProvider
    .state('guest', {
        url: '/guest/welcome',
        views: {
            main: {
                templateUrl: 'guest/layout.html'
            }
        }
    })
    
    .state('member', {
        abstract: true,
        views: {
            main: {
                templateUrl: 'member/layout.html',
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

    $urlRouterProvider.otherwise('/member/identity/main');
}

export default appStates;