'use strict';

function GuestLoadingController($rootScope, $scope, $log, $timeout, $state, $stateParams, EVENTS, SqlLiteService) {
    'ngInject'

    $log.info('GuestLoadingController');

    const status = {
        isSqlDBReady: false
    }

    $scope.header = 'Loading';
    $scope.subHeader = '';

    init();

    function init() {
        if ($stateParams.redirectTo) {
            if ($stateParams.redirectTo === 'guest.create.step-5') {
                $scope.header = 'Wallet Setup Complete';
                $timeout(() => {
                    goTo("member.dashboard.main");
                }, 2000);
            }
        }
    }

    function loadSqlLiteData() {
        $rootScope.loadingPromise = SqlLiteService.loadData();
        $rootScope.loadingPromise.then(() => {
            goTo('guest.welcome');
        }).catch((error) => {
            $log.error("error", error);
        });
    }

    function goTo(state) {
        $state.go(state);
        $rootScope.checkTermsAndConditions();
    }

    $rootScope.$on('APP_SUCCESS_LOADING', () => {
        loadSqlLiteData();
    });
};

module.exports = GuestLoadingController;
