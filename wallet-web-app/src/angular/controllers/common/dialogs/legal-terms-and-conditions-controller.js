function LegalTermsAndConditionsDialog ($rootScope, $scope, $log, $mdDialog, CONFIG, ConfigStorageService) {
    'ngInject'

    $log.info('LegalTermsAndConditionsDialog');

    $scope.agree = (event) => {
        ConfigStorageService.setLegalTermsAndConditionsAgreed(true);
        $mdDialog.hide();
    };

    $scope.disagree = (event) => {
        $mdDialog.cancel();
    };
};

export default LegalTermsAndConditionsDialog;
