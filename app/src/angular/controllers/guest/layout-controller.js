function GuestLayoutController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, CommonService) {
    'ngInject'

    $log.info('GuestLayoutController');

    $scope.selectedOption = 'keystore'
    $scope.selectView = function(param) {
        $state.go(`guest.import.${param}`)
    };
};

export default GuestLayoutController;