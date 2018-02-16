function AddEditStaticDataDialogController($rootScope, $scope, $log, $q, $mdDialog, item, value, idAttributeType) {
    'ngInject'

    $log.info('AddEditStaticDataDialogController', item, value, idAttributeType);

    $scope.item = item;
    $scope.value = value;
    $scope.idAttributeType = idAttributeType;

    $scope.input = value ? value.value : null;

    $scope.close = (event) => {
        $mdDialog.hide();
    };

    $scope.save = (event) => {
        $mdDialog.hide($scope.input);
    }

};

module.exports = AddEditStaticDataDialogController;
