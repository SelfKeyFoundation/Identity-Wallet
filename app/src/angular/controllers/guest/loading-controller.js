function GuestLoadingController($rootScope, $scope, $log, $timeout, $state, $stateParams, EVENTS, SqlLiteService) {
    'ngInject'

    $log.info('GuestLoadingController');

    const status = {
        localDataLoaded: false,
        remoteDataLoaded: false
    }

    $scope.header = 'Loading';
    $scope.subHeader = '';

    init();

    function init() {
        if (!$stateParams.redirectTo) {
            $rootScope.loadingPromise = SqlLiteService.loadData();
            $rootScope.loadingPromise.then(() => {
                $state.go('guest.welcome');
                $rootScope.checkTermsAndConditions();
            }).catch((error) => {
                $log.error("error", error);
            });
        } else {
            if ($stateParams.redirectTo === 'member.id-wallet.main') {
                $scope.header = 'Setup Completed';
                $timeout(() => {
                    $state.go($stateParams.redirectTo);
                }, 2000);
            }
        }
    }

    $rootScope.$on(EVENTS.APP_DATA_LOAD, () => {
        status.localDataLoaded = true;

        if (status.remoteDataLoaded) {
            $state.go('guest.welcome');
        }
    });

    $rootScope.$on(EVENTS.REMOTE_DATA_LOAD, () => {
        status.localDataLoaded = true;
        if (status.remoteDataLoaded) {
            $state.go('guest.welcome');
        }
    });
};

module.exports = GuestLoadingController;
