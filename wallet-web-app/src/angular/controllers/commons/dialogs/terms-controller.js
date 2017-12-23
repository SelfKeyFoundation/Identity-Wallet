function TermsDialogController($rootScope, $scope, $log, $q, $mdDialog) {
    'ngInject'

    $log.info('TermsDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

};

export default TermsDialogController;