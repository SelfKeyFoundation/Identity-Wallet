function MemberSetupStep4Controller($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ConfigFileService, CommonService, ElectronService, EtherScanService) {
    'ngInject'

    $log.info('MemberSetupStep4Controller', $stateParams, $rootScope.initialSetupProgress);
    $scope.currentStep = $stateParams.step;

    $scope.texts = {};

    $scope.texts[$rootScope.INITIAL_ID_ATTRIBUTES.REQ_4] = {
        text1: "step 2",
        text2: "Upload Your National ID with selfie",
        text3: "Your National ID",
        text4: "Select National ID",
        text5: "This is stored locally.",
        text6: "uploaded"
    };

    $scope.getTextForStep = () => {
        
    }


    /*
    "initialIdAttributes": {
                    "REQ_1": {"attributeType": "name"},
                    "REQ_2": {"attributeType": "email"},
                    "REQ_3": {"attributeType": "physical_address"},
                    "REQ_4": {"attributeType": "national_id"},
                    "REQ_5": {"attributeType": "national_id", "selfie": true}
                },

    */
    let messagesContainer = angular.element(document.getElementById("message-container"));

    $scope.goToStep = (step) => {
        $state.go('member.setup.step-3', { step: step });
    }

    $scope.goToBaseStep = () => {
        $state.go('member.setup.step-1', { skipStep2: true });
    }

    $scope.selectFile = (event) => {
        // $rootScope.initialSetupProgress - contains subcategory <-> item

        let fileSelectPromise = ElectronService.openFileSelectDialog(event);
        fileSelectPromise.then((resp) => {
            if (!resp || !resp.path) return;

            let store = ConfigFileService.getStore();

            let moveFilePrimise = ElectronService.moveFile(resp.path, store.settings.documentsDirectoryPath);
            moveFilePrimise.then((filePath) => {
                $rootScope.initialSetupProgress[$scope.currentStep].path = filePath;
                // we need file metadata
                ConfigFileService.save().then(() => {
                    // success
                });
            }).catch((error) => {
                $log.info(error, "?????");
            });
        });
    }

    $scope.functionWithPromise = function () {
        let defer = $q.defer();

        $timeout(() => {
            defer.resolve();
        }, 3000);


        return defer.promise;
    };


    $scope.nextStep = (event, form) => {
        //$scope.myTestPromise = $scope.functionWithPromise();

        switch ($scope.currentStep) {
            case $rootScope.INITIAL_ID_ATTRIBUTES.REQ_4:
                let store = ConfigFileService.getStore();
                if(!store.setup.icoAdsShown){
                    $state.go('member.setup.completed');
                }else{
                    // TODO - mark setup.status as 'done'
                    $state.go('member.dashboard.main');
                }
                break;
        }

    }


};

export default MemberSetupStep4Controller;