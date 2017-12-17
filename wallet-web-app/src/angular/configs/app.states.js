'use strict';

import IdAttribute from '../classes/id-attribute.js';
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

    function getAppData($rootScope, $q, $state) {
        let defer = $q.defer();

        // TODO
        // load data at first

        // TODO - temporary idAttributes
        $rootScope.idAttributes = [
            new IdAttribute('Global Attribute', 'Name', 'Static Data', ['individual']),
            new IdAttribute('Global Attribute', 'Public Key', 'Static Data', ['individual']),
            new IdAttribute('Global Attribute', 'Physical Address', 'Static Data', ['individual']),
            new IdAttribute('Identity Document', 'Passport', 'Document', ['individual']),
            new IdAttribute('Proof of Wealth', 'Tax Certificate', 'Document', ['individual', 'company']),
        ];

        // TODO - temporary icos
        let ico1 = new Ico();
        ico1.companyName = 'GATCOIN';
        ico1.status = 'active';
        ico1.teamLoaction = 'Hong Kong';
        ico1.video = 'https://www.youtube.com/watch?v=qq0_WVK8lMc';
        ico1.shortDescription = '';
        ico1.description = 'GATCOIN is an eCommerce platform which...';
        ico1.category = 'Retail';
        ico1.startDate = '15 Dec 2017';
        ico1.endDate = '15 Jan 2018';
        ico1.capital.total = '35,870,370 USD';
        ico1.capital.raised = '1,000,000 USD';
        ico1.capital.goal = '35,870,370 USD';
        ico1.ticker = 'GAT';
        ico1.token.total = '??';
        ico1.token.totalForSale = '1,000,000,000';
        ico1.token.price = '1 GAT = 0.20 USD';
        ico1.token.issue = 'Ongoing';
        ico1.preSale.sold = '1,000,000 USD';
        ico1.preSale.bonus = '1 GAT = 0.167 USD';
        ico1.whitelist = 'YES';
        ico1.kyc.required = 'YES';
        ico1.kyc.template = '';
        ico1.accepts = ['BTC', 'ETH'];
        ico1.restrictions = 'NA';
        ico1.whitepaper = 'https://www.gatcoin.io/wp-content/uploads/2017/09/170919v2-Whitepaper-EN.pdf';
        ico1.website = 'https://www.gatcoin.io/';


        let ico2 = new Ico();
        ico1.companyName = 'Polymath';
        ico1.status = 'Upcoming';
        ico1.teamLoaction = 'Toronto';
        ico1.video = 'https://player.vimeo.com/video/229056870';
        ico1.shortDescription = '';
        ico1.description = '';
        ico1.category = 'Finance';
        ico1.startDate = '';
        ico1.endDate = '';
        ico1.capital.total = '';
        ico1.capital.raised = '';
        ico1.capital.goal = '';
        ico1.ticker = 'PLY';
        ico1.token.total = '';
        ico1.token.totalForSale = '';
        ico1.token.price = '';
        ico1.token.issue = '';
        ico1.preSale.sold = '';
        ico1.preSale.bonus = '';
        ico1.whitelist = 'YES';
        ico1.kyc.required = 'YES';
        ico1.kyc.template = '';
        ico1.accepts = ['TBA'];
        ico1.restrictions = 'TBA';
        ico1.whitepaper = 'https://drive.google.com/file/d/0B2pD5w-G5-sJVGc5YjdmZ0hsYVE/view';
        ico1.website = 'https://polymath.network/';


        let ico3 = new Ico();
        ico1.companyName = 'Aditus Network';
        ico1.status = 'active';
        ico1.teamLoaction = 'Singapore';
        ico1.video = 'https://medium.com/aditusnetwork/forbes-cites-aditus-as-key-blockchain-player-9bb51481ac5b';
        ico1.shortDescription = '';
        ico1.description = '';
        ico1.category = 'Luxury Goods';
        ico1.startDate = '30 Nov 2017';
        ico1.endDate = '13 December 2017';
        ico1.capital.total = '11,000,000 USD';
        ico1.capital.raised = '4717639 USD';
        ico1.capital.goal = '11,000,000 USD';
        ico1.ticker = 'ADI';
        ico1.token.total = '450,000,000';
        ico1.token.totalForSale = '1,000,000,000';
        ico1.token.price = '1 ADI = 0.05 USD';
        ico1.token.issue = '';
        ico1.preSale.sold = '4,717,639 USD';
        ico1.preSale.bonus = '3% until 6 December 2017 6pm SGT, 2% until 13 December 2017 10pm SGT';
        ico1.whitelist = 'YES';
        ico1.kyc.required = 'YES';
        ico1.kyc.template = '';
        ico1.accepts = ['BTC', 'ETH'];
        ico1.restrictions = 'US Citizens, Chinese Citizens';
        ico1.whitepaper = 'https://www.aditus.net/';
        ico1.website = 'https://www.gatcoin.io/';


        let ico4 = new Ico();
        ico1.companyName = 'AiX';
        ico1.status = 'Upcoming';
        ico1.teamLoaction = 'London';
        ico1.video = 'https://aix.trade/wp-content/uploads/2017/11/AiX-Trading.-Transformed.mp4';
        ico1.shortDescription = '';
        ico1.description = '';
        ico1.category = 'Finance';
        ico1.startDate = 'TBA';
        ico1.endDate = 'TBA';
        ico1.capital.total = 'TBA';
        ico1.capital.raised = 'TBA';
        ico1.capital.goal = 'TBA';
        ico1.ticker = 'AIX';
        ico1.token.total = 'TBA';
        ico1.token.totalForSale = 'TBA';
        ico1.token.price = 'TBA';
        ico1.token.issue = 'TBA';
        ico1.preSale.sold = 'TBA';
        ico1.preSale.bonus = 'TBA';
        ico1.whitelist = 'YES';
        ico1.kyc.required = 'YES';
        ico1.kyc.template = '';
        ico1.accepts = ['TBA'];
        ico1.restrictions = 'TBA';
        ico1.whitepaper = 'https://aix.trade/ai-x_whitepaper.pdf';
        ico1.website = 'https://aix.trade/';


        let ico5 = new Ico();
        ico1.companyName = 'HoToKeN';
        ico1.status = 'Upcoming';
        ico1.teamLoaction = 'Bangkok';
        ico1.video = '';
        ico1.shortDescription = '';
        ico1.description = '';
        ico1.category = '';
        ico1.startDate = '';
        ico1.endDate = '';
        ico1.capital.total = '';
        ico1.capital.raised = '';
        ico1.capital.goal = '';
        ico1.ticker = '';
        ico1.token.total = '';
        ico1.token.totalForSale = '';
        ico1.token.price = '';
        ico1.token.issue = '';
        ico1.preSale.sold = '';
        ico1.preSale.bonus = '';
        ico1.whitelist = '';
        ico1.kyc.required = '';
        ico1.kyc.template = '';
        ico1.accepts = ['TBA'];
        ico1.restrictions = '';
        ico1.whitepaper = '';
        ico1.website = '';


        let ico6 = new Ico();
        ico1.companyName = 'Kommerce';
        ico1.status = 'Upcoming';
        ico1.teamLoaction = 'Singapore';
        ico1.video = '';
        ico1.shortDescription = '';
        ico1.description = '';
        ico1.category = '';
        ico1.startDate = '';
        ico1.endDate = '';
        ico1.capital.total = '';
        ico1.capital.raised = '';
        ico1.capital.goal = '';
        ico1.ticker = '';
        ico1.token.total = '';
        ico1.token.totalForSale = '';
        ico1.token.price = '';
        ico1.token.issue = '';
        ico1.preSale.sold = '';
        ico1.preSale.bonus = '';
        ico1.whitelist = '';
        ico1.kyc.required = '';
        ico1.kyc.template = '';
        ico1.accepts = ['TBA'];
        ico1.restrictions = '';
        ico1.whitepaper = '';
        ico1.website = '';

        $rootScope.icos = [
            ico1,
            ico2,
            ico3,
            ico4,
            ico5,
            ico6
        ]

        defer.resolve();

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

                    ConfigFileService.load().then(() => {
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
                        for (let i in $rootScope.initialSetupProgress) {
                            if (!$rootScope.initialSetupProgress[i]) {
                                isMissing = true;
                                break;
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
                    templateUrl: 'member/marketplace/ico/list.html'
                }
            }
        })

        .state('member.marketplace.ico-item', {
            url: '/member/marketplace/ico/item/:id',
            views: {
                main: {
                    templateUrl: 'member/marketplace/ico/item.html'
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
                    templateUrl: 'member/wallet/main.html',
                    controller: 'MemberWalletMainController'
                }
            }
        })

        .state('member.wallet.manage-token', {
            url: '/member/wallet/token/:id/manage',
            views: {
                main: {
                    templateUrl: 'member/wallet/manage-token.html'
                }
            }
        })


    $urlRouterProvider.otherwise('/guest/loading');

    //$urlRouterProvider.otherwise('/member/wallet/main');
}

export default appStates;