function MemberProfileController($rootScope, $scope, $stateParams, $transitions) {
	'ngInject';

	$transitions.onSuccess({ to: true }, function($state) {
		$scope.companyId = $stateParams.companyId;
		$scope.$apply();
	});
}
MemberProfileController.$inject = ['$rootScope', '$scope', '$stateParams', '$transitions'];
module.exports = MemberProfileController;
