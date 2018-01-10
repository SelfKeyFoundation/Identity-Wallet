function AddCustomTokenDialogController($rootScope, $scope, $log, $q, $mdDialog, ConfigFileService) {
    'ngInject'

    $log.info('AddCustomTokenDialogController');

    $scope.userInput = {
        symbol: null,
        address: null,
        decimal: null
    }

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.save = (event, tokenForm) => {
        if (tokenForm.$valid) {
            let store = ConfigFileService.getStore();
            store.tokens[$scope.userInput.symbol] = {
                type: "custom",
                contract: {
                    symbol: $scope.userInput.symbol,
                    address: $scope.userInput.address,
                    decimal: $scope.userInput.decimal,
                    type: 'default'
                }
            }

            ConfigFileService.save().then((store) => {
                console.log(ConfigFileService.getStore());
            }).catch((error) => {
                console.log(error);
            })
        }
    }
};

export default AddCustomTokenDialogController;