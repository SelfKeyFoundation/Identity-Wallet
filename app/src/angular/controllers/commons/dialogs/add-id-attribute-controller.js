function AddIdAttributeDialog($rootScope, $scope, $log, $mdDialog, ElectronService) {
    'ngInject';

    $log.info('AddIdAttributeDialog');

    $scope.item = {};

    $scope.selectFile = (event) => {
        let promise = ElectronService.openFileSelectDialog(event);
        promise.then((resp) => {
            if (resp && resp.path) {
                $scope.item.value = resp.path;
                $scope.item.contentType = resp.mimeType;
                $scope.item.size = resp.size;
            }
        });
    }

    $scope.save = () => {
        if ($scope.item.value && $scope.item.name) {
            $mdDialog.hide($scope.item);
        }
    }

    $scope.cancel = () => {
        $mdDialog.cancel();
    }
}

export default AddIdAttributeDialog;











