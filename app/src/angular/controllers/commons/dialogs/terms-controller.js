'use strict';

function TermsDialogController($rootScope, $scope, $log, $q, $mdDialog, SqlLiteService) {
    'ngInject'

    $log.info('TermsDialogController');
    $scope.storeSavePromise = null;
    $scope.step = 'main'
    $scope.scrolledBottom = false;

    $scope.changeStep = (step) => {
        $scope.step = step;
    }

    $scope.agree = (event) => {
        let guideSettings = SqlLiteService.getGuideSettings();
        guideSettings.termsAccepted = true;

        SqlLiteService.saveGuideSettings(guideSettings).then(()=>{
            $mdDialog.hide();
        });
    };

    $scope.notAgree = (event) => {
        $rootScope.closeApp();
    };

    $scope.scrollToEndContainer = (direction) => {
        if (direction === 'bottom') {
            $scope.scrolledBottom = true;
            $scope.$apply()
        }
    }
};

module.exports = TermsDialogController;
