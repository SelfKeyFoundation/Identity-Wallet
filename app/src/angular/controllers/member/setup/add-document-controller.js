'use strict';

function MemberSetupAddDocumentController($rootScope, $scope, $log, $state, $stateParams, ConfigFileService, ElectronService, CommonService) {
    'ngInject'

    $log.info('MemberSetupAddDocumentController');

    $scope.idAttributes = $rootScope.wallet.getIdAttributes();

    const ID_ATTRIBUTES = {
        'national_id': {
            type: "national_id",
            step: "STEP 4",
            title1: "Upload Your National ID",
            title2: "Your National ID",
            title3: "(can be driver's license, passport)",
            title4: "(Minimal size 1600x900px)",
        },
        'id_selfie': {
            type: "id_selfie",
            step: "STEP 5",
            title1: "Upload Selfie With ID",
            title2: "Selfie With National ID",
            title3: "(can be driver's license, passport)",
            title4: "(Minimal size 1600x900px)",
        }
    }

    $scope.selected = ID_ATTRIBUTES[$stateParams.type]
    $scope.selected.values = $rootScope.wallet.getIdAttributeItemValue($scope.selected.type);

    $scope.nextStep = (event) => {
        if ($stateParams.type === 'national_id') {
            $state.go('member.setup.add-document', { type: 'id_selfie' });
        } else {
            // TODO
            // 1) find missing ID attributes
            // 2) register alerts

            $state.go('member.dashboard.main');
        }
    }

    /*
    $scope.selectFile = (event) => {
        let fileSelectPromise = ElectronService.openFileSelectDialog({
            filters: [
                { name: 'Documents', extensions: ['jpg', 'png', 'pdf'] },
            ],
            maxFileSize: 50 * 1000 * 1000
        });

        fileSelectPromise.then((resp) => {
            if (!resp || !resp.path) return;

            let moveFilePrimise = ElectronService.moveFile(resp.path, store.settings.documentsDirectoryPath);
            moveFilePrimise.then((filePath) => {

                let fileItem = {
                    name: resp.name,
                    mimeType: resp.mimeType,
                    size: resp.size,
                    path: filePath,
                }

                let item = getIdAttributeItem($scope.selected.type);
                if(item.values.length){
                    item.values[0].value = fileItem;
                }else{
                    item.addValue(fileItem);
                }

                ConfigFileService.save().then((newStore) => {
                    store = newStore;
                    $scope.selected.values = getIdAttributeItemValues($scope.selected.type);
                    CommonService.showToast('success', 'Saved!');
                });
            }).catch((error) => {
                $log.error(error);
                CommonService.showToast('error', 'Error while selecting document');
            });
        }).catch((error) => {
            CommonService.showToast('error', 'Max File Size: 50mb Allowed');
        });
    }
    */

};

module.exports = MemberSetupAddDocumentController;
