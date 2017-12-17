function MemberSetupStep2Controller($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, CommonService) {
    'ngInject'

    $log.info('MemberSetupStep2Controller');
    
    let messagesContainer = angular.element(document.getElementById("message-container"));

    $scope.nextStep = (event, form) => {
        $state.go('member.setup.step-3', {step: 'Passport'});
    }

};

export default MemberSetupStep2Controller;