function GuestLoadingController($rootScope, $scope, $log, $timeout, $state, EVENTS, SqlLiteService) {
    'ngInject'

    $log.info('GuestLoadingController');

    const status = {
        localDataLoaded: false,
        remoteDataLoaded: false
    }

    init();

    function init() {
        $rootScope.loadingPromise = SqlLiteService.loadData();
        $rootScope.loadingPromise.then(() => {
            $state.go('guest.welcome');
            $rootScope.checkTermsAndConditions();
        }).catch((error) => {
            $log.error("error", error);
        });
    }

    $rootScope.$on(EVENTS.APP_DATA_LOAD, () => {
        status.localDataLoaded = true;

        if(status.remoteDataLoaded){
            $state.go('guest.welcome');
        }
    });

    $rootScope.$on(EVENTS.REMOTE_DATA_LOAD, () => {
        status.localDataLoaded = true;

        if(status.remoteDataLoaded){
            $state.go('guest.welcome');
        }
    });
};

module.exports = GuestLoadingController;
