function GuestKeystoreCreateStep2Controller($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, $mdDialog, countries) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep2Controller');

    $scope.countryList = countries.countryList;

    $scope.input = {
        firstName: "",
        lastName: "",
        middleName: "",
        countryOfResidency: ""
    };




    $scope.nextStep = (event, form) => {
        if(!form.$valid) return;

        $mdDialog.show({
            controller: 'PasswordWarningDialogController',
            templateUrl: 'common/dialogs/password-warning.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                basicInfo: $scope.input
            }
        });
    }

    // TODO remove
    $scope.createKeystore = (event) => {
        if(!$scope.userInput.password) {
            CommonService.showMessage({
                container: messagesContainer,
                type: "error",
                message: "password is required",
                closeAfter: 1500,
                replace: true
            });
            return;
        }

        if($scope.userInput.password !== $stateParams.thePassword) {
            CommonService.showMessage({
                container: messagesContainer,
                type: "error",
                message: "wrong password",
                closeAfter: 1500,
                replace: true
            });
            return;
        }

        let promise = WalletService.createKeystoreFile($scope.userInput.password);
        promise.then((wallet) => {
            $rootScope.wallet = wallet;
            
            // reload store
            ConfigFileService.load().then((storeData) => {
                $state.go('guest.create.step-3')
            });
        }).catch((error)=>{
            $log.error(error);
        });
    }

};

module.exports = GuestKeystoreCreateStep2Controller;