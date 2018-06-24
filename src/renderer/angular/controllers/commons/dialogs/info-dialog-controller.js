'use strict';

function InfoDialogController($rootScope, $scope, $log, $mdDialog, text, title) {
	'ngInject';

	$scope.text = text;
	$scope.title = title;

	$scope.cancel = event => {
		$mdDialog.cancel();
	};
}
InfoDialogController.$inject = ['$rootScope', '$scope', '$log', '$mdDialog', 'text', 'title'];
module.exports = InfoDialogController;
