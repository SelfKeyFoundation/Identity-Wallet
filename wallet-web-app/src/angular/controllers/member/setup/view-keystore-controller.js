function MemberSetupViewKeystoreController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService, CommonService) {
    'ngInject'

    $log.info('MemberSetupViewKeystoreController');
    
    $scope.showPrivateKey = false;
    $scope.privateKeyInputType = 'password';

    $scope.togglePrivateKeyVisibility = () => {
        $scope.showPrivateKey = !$scope.showPrivateKey;
        $scope.privateKeyInputType = $scope.showPrivateKey ? 'text' : 'password';
    }

};

export default MemberSetupViewKeystoreController;