function MemberSetupStep3Controller($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ConfigFileService, CommonService, ElectronService) {
    'ngInject'

    $log.info('MemberSetupStep3Controller', $stateParams, $rootScope.initialSetupProgress);
    $scope.currentStep = $stateParams.step;

    $scope.texts = {
        "passport": {
            text1: "step 4",
            text2: "Upload Your Passport",
            text3: "Your Passport",
            text4: "Select Passport",
            text5: "This is stored locally.",
            text6: "uploaded"
        },
        "national-id": {
            text1: "step 5",
            text2: "Upload Your National ID",
            text3: "Your National ID",
            text4: "Select National ID",
            text5: "This is stored locally.",
            text6: "uploaded"
        },
        "utility-bill": {
            text1: "step 6",
            text2: "Upload Your Utility Bill",
            text3: "Your Utility Bill",
            text4: "Select Utility Bill",
            text5: "This is stored locally.",
            text6: "uploaded"
        }
    }

    let messagesContainer = angular.element(document.getElementById("message-container"));

    $scope.goToStep = (step) => {
        $state.go('member.setup.step-3', { step: step });
    }

    $scope.goToBaseStep = () => {
        $state.go('member.setup.step-1', { skipStep2: true });
    }

    $scope.selectFile = (event) => {
        let fileSelectPromise = ElectronService.openFileSelectDialog(event);
        fileSelectPromise.then((filePath) => {
            if(!filePath) return;

            let store = ConfigFileService.getStore();

            let moveFilePrimise = ElectronService.moveFile(filePath, store.settings.documentsDirectoryPath);
            moveFilePrimise.then((filePath) => {
                let doc = null;

                let res = ConfigFileService.getDocumentsByType($scope.currentStep);
                if (res.length > 0) {
                    doc = res[0];
                } else {
                    doc = {
                        type: $scope.currentStep,
                        name: $scope.texts[$scope.currentStep].text3,
                        filePath: filePath,
                        isDefault: true
                    }
                }

                ConfigFileService.addDocument(doc);
                ConfigFileService.save().then(() => {
                    $rootScope.initialSetupProgress[$scope.currentStep] = true;
                    $log.info($rootScope.initialSetupProgress);
                });
            }).catch((error) => {
                $log.info(error, "?????");
            });
        });
    }

    $scope.nextStep = (event, form) => {
        switch ($scope.currentStep) {
            case 'passport':
                $state.go('member.setup.step-3', { step: 'national-id' });
                break;
            case 'national-id':
                $state.go('member.setup.step-3', { step: 'utility-bill' });
                break;
            case 'utility-bill':
                // TODO
                break;
        }

    }

};

export default MemberSetupStep3Controller;