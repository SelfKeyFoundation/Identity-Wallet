function GuestLoadingController($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ConfigFileService, WalletService, Web3Service, SelfkeyService, SqlLiteService) {
    'ngInject'

    $log.info('GuestLoadingController');

    switch ($stateParams.redirectTo) {
        case 'member.setup.view-keystore':
            $state.go($stateParams.redirectTo);
            $scope.subHeader = "Getting Ready"
            break;
        default:
            init();
    }

    function init() {
        $rootScope.loadingPromise = SqlLiteService.loadData();

        $rootScope.loadingPromise.then(() => {
            let publicKeys = SqlLiteService.getWalletPublicKeys();
            let wallets = SqlLiteService.getWallets();

            if (publicKeys.length > 0) {
                WalletService.importUsingKeystoreFilePath(wallets[0].keystoreFilePath).then((wallet) => {
                    $rootScope.wallet = wallet;
                    $state.go('guest.welcome');
                }).catch((error) => {
                    $log.error("error", error);
                });
            } else {
                $state.go('guest.welcome');
            }

            $rootScope.checkTermsAndConditions();
        }).catch((error) => {
            $log.error("error", error);
        });
    }
};

module.exports = GuestLoadingController;
