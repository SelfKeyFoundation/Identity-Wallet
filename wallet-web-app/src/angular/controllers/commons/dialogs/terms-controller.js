function TermsDialogController($rootScope, $scope, $log, $q, $mdDialog, ElectronService, ConfigFileService) {
    'ngInject'

    $log.info('TermsDialogController');
    $scope.storeSavePromise = null;

    $scope.agree = (event) => {
        let store = ConfigFileService.getStore();
        store.setup = store.setup || {};
        store.setup.termsAccepted = true;
        $scope.storeSavePromise = ConfigFileService.save();
        $scope.storeSavePromise.then(() => {
            $mdDialog.hide();
        });
    };

    $scope.notAgree = (event) => {
        $rootScope.closeApp();
    };


    // Todo change with $timeout
    setTimeout(function () {
        $scope.scrolledBottom = true;
        var elem = angular.element(document.querySelector(".textual"));
        var elemChild = angular.element(document.querySelector(".text"));

        var wholeHeight = elemChild[0].scrollHeight;
        var visibleHeight = elem[0].offsetHeight;
        elem.on("scroll", function (ev) {
            if (elem[0].scrollTop >= (wholeHeight - visibleHeight - 50)) {
                $scope.scrolledBottom = false;
            }
        });
    }, 1000)
};

export default TermsDialogController;