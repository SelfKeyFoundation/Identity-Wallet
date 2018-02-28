'use strict';

function AddIdAttributeDialogController($rootScope, $scope, $log, $mdDialog, SqlLiteService, excludeKeys, type) {
    'ngInject';

    $log.info("AddIdAttributeDialogController", excludeKeys);

    $scope.globalAttributes = {};
    $scope.idDocuments = {};
    $scope.proofOfAddresses = {};
    //$scope.onlineIdentityAttributes = {};

    let data = SqlLiteService.getIdAttributeTypes();

    for(let i in data){
        if(excludeKeys.indexOf(data[i].key) !== -1 || data[i].type !== type) continue;
        switch (data[i].category) {
            case "global_attribute":
                $scope.globalAttributes[i] = data[i];
                break;
            case "id_document":
                $scope.idDocuments[i] = data[i];
                break;
            case "proof_of_address":
                $scope.proofOfAddresses[i] = data[i];
                break;
            //case "online_identity_attribute":
            //    $scope.onlineIdentityAttributes[i] = data[i];
            //    break;
        }
    }

    $scope.getLength = (obj) => {
        return Object.keys(obj).length;
    }

    $scope.item = {};

    $scope.save = (event) => {
        if ($scope.selectedKey) {
            $mdDialog.hide(data[$scope.selectedKey]);
        }
    }

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }
}

module.exports = AddIdAttributeDialogController;
