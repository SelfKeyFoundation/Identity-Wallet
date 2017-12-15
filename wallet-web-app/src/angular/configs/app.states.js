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
            },
            resolve: {
                checkSetupProgress: ($rootScope, $q, $state, ConfigFileService) => {
                    let defer = $q.defer();

                    $rootScope.initialSetupProgress = {
                        "full-name": false,
                        "email": false,
                        "phone-number": false,
                        "passport": false,
                        "national-id": false,
                        "utility-bill": false
                    }
                    
                    ConfigFileService.load().then(()=>{
                        let fullNames = ConfigFileService.findContactsByType('full-name');
                        let emails = ConfigFileService.findContactsByType('email');
                        let phoneNumbers = ConfigFileService.findContactsByType('phone-number');

                        let passports = ConfigFileService.getDocumentsByType('passport');
                        let nationalIds = ConfigFileService.getDocumentsByType('national-id');
                        let utilityBills = ConfigFileService.getDocumentsByType('utility-bill');
                        
                        $rootScope.initialSetupProgress["full-name"] = fullNames.length > 0 ? true : false;
                        $rootScope.initialSetupProgress["email"] = emails.length > 0 ? true : false;
                        $rootScope.initialSetupProgress["phone-number"] = phoneNumbers.length > 0 ? true : false;
                        $rootScope.initialSetupProgress["passport"] = passports.length > 0 ? true : false;
                        $rootScope.initialSetupProgress["national-id"] = nationalIds.length > 0 ? true : false;
                        $rootScope.initialSetupProgress["utility-bill"] = utilityBills.length > 0 ? true : false;

                        let isMissing = false;
                        for(let i in $rootScope.initialSetupProgress){
                            if(!$rootScope.initialSetupProgress[i]){
                                isMissing = true;
                                break;
                            }
                        }

                        if(isMissing){
                            defer.resolve();
                        }else{
                            $state.go('member.dashboard.main');
                        }
                    }).catch(()=>{
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
            url: '/member/marketplace/ico-list',
            views: {
                main: {
                    templateUrl: 'member/marketplace/ico-list.html'
                }
            }
        })

        .state('member.marketplace.ico-list-item', {
            url: '/member/marketplace/ico-list-item/:id',
            views: {
                main: {
                    templateUrl: 'member/marketplace/ico-list-item.html'
                }
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
                    templateUrl: 'member/wallet/main.html'
                }
            }
        })

    
    $urlRouterProvider.otherwise('/guest/loading');

    //$urlRouterProvider.otherwise('/member/wallet/main');
}

export default appStates;