'use strict';

function MemberSetupAddDocumentController($rootScope, $scope, $log, $state, $stateParams, CommonService, RPCService, SqlLiteService) {
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
            title4: "(Max file size: 50mb)",
        },
        'id_selfie': {
            type: "id_selfie",
            step: "STEP 5",
            title1: "Upload Selfie With ID",
            title2: "National ID Selfie",
            title3: "(can be driver's license, passport)",
            title4: "(Max file size: 50mb)",
        }
    }

    $scope.selected = ID_ATTRIBUTES[$stateParams.type]
    $scope.selected.values = $rootScope.wallet.getIdAttributeItemValue($scope.selected.type);

    $scope.nextStep = (event) => {
        goToNextStep ();
    }

    $scope.selectFile = (event) => {
        let selectedValue = $scope.idAttributes[$scope.selected.type].items[0].values[0];
        let actionText = 'Created Document: ';
        let actionTitle = 'Created';
        if(selectedValue.documentId){
            actionText = 'Updated Document: ';
            actionTitle = 'Updated';
        }

        let addDocumentPromise = RPCService.makeCall('openDocumentAddDialog', { idAttributeItemValueId: selectedValue.id });
        addDocumentPromise.then((resp) => {
            if(!resp) return;
            $rootScope.wallet.loadIdAttributes().then((resp)=>{
                $scope.idAttributes = $rootScope.wallet.getIdAttributes();
                CommonService.showToast('success', 'Saved!');
                $scope.selected.values = "Saved!";

                SqlLiteService.registerActionLog(actionText + $rootScope.DICTIONARY[$stateParams.type], actionTitle);

                goToNextStep();
            });
        }).catch((error) => {
            CommonService.showToast('error', 'The file could not be uploaded. The file exceeds the maximum upload size. Please upload file no larger than 50 MB.');
        });
    }

    $scope.skip = (event) => {
        $state.go('member.dashboard.main');
    }

    function goToNextStep () {
        if ($stateParams.type === 'national_id') {
            $state.go('member.setup.add-document', { type: 'id_selfie' });
        } else {
            // got to loading
            $state.go('guest.loading', {redirectTo: 'member.id-wallet.main'});
            //$state.go('member.dashboard.main');
        }
    }
};

module.exports = MemberSetupAddDocumentController;
