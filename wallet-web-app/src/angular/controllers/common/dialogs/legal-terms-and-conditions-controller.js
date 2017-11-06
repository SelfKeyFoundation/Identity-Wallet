function LegalTermsAndConditionsDialog ($scope, $log, $mdDialog, ConfigStorageService, showActionButtons) {
    'ngInject'

    $log.info('LegalTermsAndConditionsDialog');

    $scope.cancel = (event) => {
        $mdDialog.hide();
    };

    $scope.agree = (event) => {
        ConfigStorageService.setLegalTermsAndConditionsAgreed(true);
        $mdDialog.hide();
    };

    $scope.disagree = (event) => {
        ConfigStorageService.setLegalTermsAndConditionsAgreed(false);
        $mdDialog.cancel();
    };
};

export default LegalTermsAndConditionsDialog;
