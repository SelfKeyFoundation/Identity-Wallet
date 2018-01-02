function GuestKeystoreCreateStep2Controller($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ConfigFileService, WalletService, ElectronService, CommonService) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep2Controller');

    let messagesContainer = angular.element(document.getElementById("message-container"));

    $rootScope.wallet = null;

    $scope.userInput = {
        password: ''
    };

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
                $state.go('guest.keystore.create-step-3')
            });
        });
    }

    
};

export default GuestKeystoreCreateStep2Controller;