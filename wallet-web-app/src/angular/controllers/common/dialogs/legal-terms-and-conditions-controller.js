function LegalTermsAndConditionsDialog ($rootScope, $scope, $log, $mdDialog, CONFIG, ElectronService) {
    'ngInject'

    $log.info('LegalTermsAndConditionsDialog');

    $scope.agree = (event) => {
        $mdDialog.hide();
    };

    $scope.disagree = (event) => {
        $mdDialog.cancel();
    };
};

export default LegalTermsAndConditionsDialog;
