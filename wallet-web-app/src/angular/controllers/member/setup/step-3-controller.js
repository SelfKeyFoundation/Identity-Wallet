function MemberSetupStep3Controller($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ConfigFileService, CommonService, ElectronService, EtherScanService) {
    'ngInject'

    $log.info('MemberSetupStep3Controller', $stateParams, $rootScope.initialSetupProgress);
    $scope.currentStep = $stateParams.step;

    $scope.texts = {};
    $scope.texts[$rootScope.INITIAL_ID_ATTRIBUTES.REQ_4] = {
        text1: "step 4",
        text2: "Upload Your Passport",
        text3: "Your Passport",
        text4: "Select Passport",
        text5: "This is stored locally.",
        text6: "uploaded"
    };

    $scope.texts[$rootScope.INITIAL_ID_ATTRIBUTES.REQ_5] = {
        text1: "step 5",
        text2: "Upload Your National ID",
        text3: "Your National ID",
        text4: "Select National ID",
        text5: "This is stored locally.",
        text6: "uploaded"
    };

    $scope.texts[$rootScope.INITIAL_ID_ATTRIBUTES.REQ_6] = {
        text1: "step 6",
        text2: "Upload Your Utility Bill",
        text3: "Your Utility Bill",
        text4: "Select Utility Bill",
        text5: "This is stored locally.",
        text6: "uploaded"
    };


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
                $state.go('member.setup.step-3', { step: $rootScope.INITIAL_ID_ATTRIBUTES.REQ_5 });
                break;
            case $rootScope.INITIAL_ID_ATTRIBUTES.REQ_5:
                $state.go('member.setup.step-3', { step: $rootScope.INITIAL_ID_ATTRIBUTES.REQ_6 });
                break;
            case $rootScope.INITIAL_ID_ATTRIBUTES.REQ_6:
                // TODO - mark setup.status as 'done'
                $state.go('member.dashboard.main');
                break;
        }

    }


};

export default MemberSetupStep3Controller;