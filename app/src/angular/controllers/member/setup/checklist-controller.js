'use strict';

function MemberSetupChecklistController($rootScope, $scope, $log, $state, ConfigFileService) {
    'ngInject'

    $log.info('MemberSetupChecklistController', $rootScope.wallet.getIdAttributes());

    console.log(">>>>>>", $rootScope.wallet.getIdAttributeItemValue('first_name'));

    $scope.idAttributes = $rootScope.wallet.getIdAttributes();

    //let store = ConfigFileService.getStore();
    //$scope.name = getIdAttributeItemValues("name");

    $scope.nextStep = (event) => {
        $state.go('member.setup.add-document', { type: 'national_id' });
    }
};

module.exports = MemberSetupChecklistController;
