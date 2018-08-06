'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('MemberSetupChecklistController');
function MemberSetupChecklistController($rootScope, $scope, $state) {
	'ngInject';

	log.debug('MemberSetupChecklistController, %j', $rootScope.wallet.getIdAttributes());

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
MemberSetupChecklistController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = MemberSetupChecklistController;
