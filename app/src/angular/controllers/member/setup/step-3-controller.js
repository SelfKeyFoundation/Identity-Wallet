function MemberSetupStep3Controller($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ConfigFileService, CommonService, ElectronService, EtherScanService) {
    'ngInject'

    $log.info('MemberSetupStep3Controller', $stateParams, $rootScope.initialSetupProgress);
    $scope.currentStep = $stateParams.step;
    console.log($scope.currentStep, "????? <<<<")
    $scope.texts = {};

    // TODO replace texts with translations
    $scope.texts[$rootScope.INITIAL_ID_ATTRIBUTES.REQ_4.attributeType] = {
        "1": {
            text1: "step 2",
            text2: "Upload Your National ID",
            text3: "Your National ID",
            text4: "Select National ID",
            text5: "This is stored locally.",
            text6: "uploaded"
        },
        "2": {
            text1: "step 3",
            text2: "Upload Your National ID with selfie",
            text3: "Your National ID with selfie",
            text4: "Select National ID",
            text5: "This is stored locally.",
            text6: "uploaded"
        }
    };

    let messagesContainer = angular.element(document.getElementById("message-container"));

    $scope.goToStep = (step) => {
        $state.go('member.setup.step-3', { step: step });
    }

    $scope.goToBaseStep = () => {
        $state.go('member.setup.step-1', { skipStep2: true });
    }

    $scope.selectFile = (event) => {

        let fileSelectPromise = ElectronService.openFileSelectDialog(event);
        fileSelectPromise.then((resp) => {
            if (!resp || !resp.path) return;

            let store = ConfigFileService.getStore();

            let moveFilePrimise = ElectronService.moveFile(resp.path, store.settings.documentsDirectoryPath);
            moveFilePrimise.then((filePath) => {
                $rootScope.initialSetupProgress[$scope.currentStep.attributeType][$scope.currentStep.id].path = filePath;
                // we need file metadata
                ConfigFileService.save().then(() => {
                    // success
                });
            }).catch((error) => {
                $log.info(error, "?????");
            });
        });
    }

    $scope.nextStep = (event, form) => {
        //$scope.myTestPromise = $scope.functionWithPromise();

        if ($scope.currentStep.attributeType === 'national_id' && $scope.currentStep.selfie) {
            let store = ConfigFileService.getStore();
            if (!store.setup.icoAdsShown) {
                $state.go('member.setup.completed');
            } else {
                // TODO - mark setup.status as 'done'
                $state.go('member.dashboard.main');
            }
        } else {
            $state.go('member.setup.step-3', { step: $rootScope.INITIAL_ID_ATTRIBUTES.REQ_5 });
        }

        /*
        switch ($scope.currentStep) {
            case $rootScope.INITIAL_ID_ATTRIBUTES.REQ_4:
                $state.go('member.setup.step-3', { step: $rootScope.INITIAL_ID_ATTRIBUTES.REQ_5 });
                break;
            case $rootScope.INITIAL_ID_ATTRIBUTES.REQ_5:
                let store = ConfigFileService.getStore();
                if (!store.setup.icoAdsShown) {
                    $state.go('member.setup.completed');
                } else {
                    // TODO - mark setup.status as 'done'
                    $state.go('member.dashboard.main');
                }
                break;
        }
        */
    }


};

export default MemberSetupStep3Controller;