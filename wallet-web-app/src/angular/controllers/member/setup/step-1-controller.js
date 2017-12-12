function MemberSetupStep1Controller($rootScope, $scope, $log, $q, $timeout, $state, $stateParams, ConfigFileService, CommonService) {
    'ngInject'

    $log.info('MemberSetupStep1Controller');

    let messagesContainer = angular.element(document.getElementById("message-container"));
    let shouldSkipStep2 = $stateParams.skipStep2;

    let fullNames = ConfigFileService.findContactsByType('full-name');
    let emails = ConfigFileService.findContactsByType('email');
    let phoneNumbers = ConfigFileService.findContactsByType('phone-number');

    $scope.basicInfo = {};


    $scope.basicInfo["full-name"] = fullNames.length > 0 ? fullNames[0] : {value: '', type: 'full-name', status: 0, isDefault: true};
    $scope.basicInfo["email"] = emails.length > 0 ? emails[0] : {value: '', type: 'email', status: 0, isDefault: true};
    $scope.basicInfo["phone-number"] = phoneNumbers.length > 0 ? phoneNumbers[0] : {value: '', type: 'phone-number', status: 0, isDefault: true};

    $scope.nextStep = (event, form) => {
        for (let key in $scope.basicInfo) {
            console.log($scope.basicInfo[key]);
            if ($scope.basicInfo[key].value) {
                $rootScope.initialSetupProgress[key] = true;
                ConfigFileService.addContact($scope.basicInfo[key]);
            }
        }

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
                $state.go('member.setup.step-3', { step: "passport" });
            }
        });
    }

};

export default MemberSetupStep1Controller;