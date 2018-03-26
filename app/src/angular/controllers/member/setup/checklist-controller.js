'use strict';

function MemberSetupChecklistController($rootScope, $scope, $log, $state) {
    'ngInject'

    $log.info('MemberSetupChecklistController', $rootScope.wallet.getIdAttributes());

    $scope.idAttributes = $rootScope.wallet.getIdAttributes();

    $scope.nextStep = (event) => {
        $state.go('member.setup.add-document', { type: 'national_id' });
    }

    $scope.skip = (event) => {
        $state.go('member.dashboard.main');
    }
};

module.exports = MemberSetupChecklistController;
