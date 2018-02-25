'use strict';

function AddIdAttributeDialogController($rootScope, $scope, $log, $mdDialog, ElectronService, SelfkeyService, excludeTypes) {
    'ngInject';

    $log.info("AddIdAttributeDialogController");

    $scope.globalAttributes = {};
    $scope.idDocuments = {};
    $scope.proofOfAddresses = {};
    $scope.onlineIdentityAttributes = {};

    let idAttributes = null;
    SelfkeyService.dispatchIdAttributeTypes(true).then((data)=>{
        idAttributes = data;
        for(let i in data){
            if(excludeTypes.indexOf(data[i].key) !== -1) continue;

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
                case "online_identity_attribute":
                    $scope.onlineIdentityAttributes[i] = data[i];
                    break;
            }
        }
    }).catch((error)=>{
        $log.error(error, "??????")
    });

    $scope.item = {};

    $scope.save = (event) => {
        if ($scope.selectedKey) {
            $mdDialog.hide(idAttributes[$scope.selectedKey]);
        }
    }

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }
}

module.exports = AddIdAttributeDialogController;
