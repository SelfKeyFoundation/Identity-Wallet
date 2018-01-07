function MemberSetupStep1Controller($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ConfigFileService, CommonService, countries) {
    'ngInject'

    $log.info('MemberSetupStep1Controller');

    $scope.countries = countries.countryList;

    let messagesContainer = angular.element(document.getElementById("message-container"));
    let shouldSkipStep2 = $stateParams.skipStep2;

    console.log("############", $rootScope.initialSetupProgress);


    /**
     * initial setup progress data
     * $rootScope.initialSetupProgress
     */

    $scope.nextStep = (event, form) => {
        ConfigFileService.save().then(() => {
            CommonService.showMessage({
                container: messagesContainer,
                type: "info",
                message: "Saved",
                closeAfter: 2000
            });

            if (!shouldSkipStep2) {
                $state.go('member.setup.step-2');
            } else {
                $state.go('member.setup.step-3', {step: $rootScope.INITIAL_ID_ATTRIBUTES.REQ_4});
            }
        });
    }

};

export default MemberSetupStep1Controller;