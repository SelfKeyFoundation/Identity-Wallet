function TermsDialogController($rootScope, $scope, $log, $q, $mdDialog) {
    'ngInject'

    $log.info('TermsDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    };

    $scope.scrolledBottom = false;

    var elem = angular.element(document.querySelector(".textual"));
    elem.on("scroll", function (ev) {
        $scope.scrolledBottom = true;
    });


};

export default TermsDialogController;