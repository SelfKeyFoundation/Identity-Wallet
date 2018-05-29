'use strict';

function ConfirmationDialogController($rootScope, $scope, $log, $mdDialog, text, title) {
    'ngInject'

    $scope.text = text;
    $scope.title = title;

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    };

    $scope.save = (event) => {
        $mdDialog.hide('accept');
    };
};

module.exports = ConfirmationDialogController;
