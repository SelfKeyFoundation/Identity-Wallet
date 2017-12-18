function MemberSetupStep1Controller($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ConfigFileService, CommonService) {
    'ngInject'

    $log.info('MemberSetupStep1Controller');

    let messagesContainer = angular.element(document.getElementById("message-container"));
    let shouldSkipStep2 = $stateParams.skipStep2;

    /**
     * initial setup progress data
     * $rootScope.initialSetupProgress
     */

    $scope.nextStep = (event, form) => {
        // $rootScope.initialSetupProgress - contains subcategory <-> item

        ConfigFileService.save().then(()=>{
            CommonService.showMessage({
                container: messagesContainer,
                type: "info",
                message: "Saved",
                closeAfter: 2000
            });

            if (!shouldSkipStep2) {
                $state.go('member.setup.step-2');
            } else {
                $state.go('member.setup.step-3', { step: "Passport" });
            }
        });
    }

};

export default MemberSetupStep1Controller;