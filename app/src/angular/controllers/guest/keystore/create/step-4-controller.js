function GuestKeystoreCreateStep4Controller($rootScope, $scope, $log, $q, $timeout, $state, $window, ConfigFileService, WalletService, ElectronService, CommonService) {
    'ngInject'

    $log.info('GuestKeystoreCreateStep4Controller');

    let messagesContainer = angular.element(document.getElementById("message-container"));

    $scope.privateKey = "0x" + $rootScope.wallet.getPrivateKeyHex();

    $scope.printPaperWallet = (event) => {
        $window.print();
    }

    $scope.nextStep = (event) => {
        /**
         * "REQ_1": "name",
            "REQ_2": "email",
            "REQ_3": "proof_of_residence",
            "REQ_4": "national_id"
         */

         /*
        let initialIdAttributes = $rootScope.INITIAL_ID_ATTRIBUTES;
        let store = ConfigFileService.getStore();
        let idAttributes = store.idAttributes;

        let found = 0;

        for(let i in initialIdAttributes){
            let key = initialIdAttributes[i];
            
            for(let j in idAttributes) {
                if(found === initialIdAttributes.length){
                    // done
                }
            }
        }
        */
        
        $state.go('member.setup.step-1');
    }
};

export default GuestKeystoreCreateStep4Controller;