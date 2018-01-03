function AddIdAttributeDialog($rootScope, $scope, $log, $mdDialog, ElectronService, config, item) {
    'ngInject';

    $log.info('AddIdAttributeDialog', config, item);

    if (item.idAttributeType.key === 'national_id' && item.addition.selfie) {
        item.name = "national_id_with_selfie";
    } else {
        item.name = item.idAttributeType.key;
    }

    $scope.config = config;
    $scope.item = item;

    $scope.selectFile = (event) => {
        let promise = ElectronService.openFileSelectDialog(event);
        promise.then((resp) => {
            $log.info(resp);
            if (resp && resp.path) {
                $scope.item.value = resp.path;
                $scope.item.contentType = resp.mimeType;
                $scope.item.size = resp.size;
            }
        });
    }

    $scope.save = () => {
        if (item.value && item.name) {
            $mdDialog.hide(item);
        }
    }

    $scope.cancel = () => {
        $mdDialog.cancel();
    }
}

export default AddIdAttributeDialog;











