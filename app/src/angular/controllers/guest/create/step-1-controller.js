function GuestKeystoreCreateStep1Controller($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService, ElectronService, CommonService) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep1Controller');

    let messagesContainer = angular.element(document.getElementById("message-container"));

    

    $scope.createBasicId = (event) => {
        $state.go('guest.create.step-2');
    }

    $scope.nextStep = (event) => {
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

        if($scope.userInput.password.length < 8) {
            CommonService.showMessage({
                container: messagesContainer,
                type: "error",
                message: "password length must be min 8 chars",
                closeAfter: 1500,
                replace: true
            });
            return;
        }

        if($scope.userInput.password !== $scope.userInput.rPassword) {
            CommonService.showMessage({
                container: messagesContainer,
                type: "error",
                message: "Password confirmation doesn't match Password",
                closeAfter: 1500,
                replace: true
            });
            return;
        }
       
        $state.go('guest.create.step-2', {thePassword: $scope.userInput.password});
    }

   
};

module.exports = GuestKeystoreCreateStep1Controller;