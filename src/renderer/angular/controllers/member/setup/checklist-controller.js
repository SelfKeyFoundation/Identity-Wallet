'use strict';

function MemberSetupChecklistController($rootScope, $scope, $log, $state) {
	'ngInject';

	$log.info('MemberSetupChecklistController', $rootScope.wallet.getIdAttributes());

	$scope.idAttributes = $rootScope.wallet.getIdAttributes();

	$scope.national_id = $rootScope.wallet.getIdAttributeItemValue('national_id');
	$scope.id_selfie = $rootScope.wallet.getIdAttributeItemValue('id_selfie');

	$scope.nextStep = event => {
		$state.go('member.setup.add-document', { type: 'national_id' });
	};

	$scope.skip = event => {
		$state.go('member.id-wallet.main');
	};
}
MemberSetupChecklistController.$inject = ['$rootScope', '$scope', '$log', '$state'];
module.exports = MemberSetupChecklistController;
