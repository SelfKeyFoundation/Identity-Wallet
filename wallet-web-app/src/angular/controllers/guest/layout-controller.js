function GuestLayoutController($rootScope, $scope, $log, $q, $timeout) {
    'ngInject'

    $log.info('GuestLayoutController');

    function startLoading () {
        let defer = $q.defer();

        $timeout(()=>{
            // 1: check setting files exists
            //    (a): create new & redirect to welcome view
            //    (b): check if wallet keystore exists
            //         (a) if exists redirect to unlock view
            //         (b) if not redirect to welcome
            $log.info("resolved");
            defer.resolve();
        }, 5000);

        return defer.promise;
    }

    $rootScope.loadingPromise = startLoading();
    $log.info($rootScope.loadingPromise, "<<<<<<<")

};

export default GuestLayoutController;