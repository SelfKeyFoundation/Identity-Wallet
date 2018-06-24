'use strict';

function AddIdAttributeDialogController(
	$rootScope,
	$scope,
	$log,
	$mdDialog,
	SqlLiteService,
	excludeKeys,
	type,
	title
) {
	'ngInject';

	$log.info('AddIdAttributeDialogController', excludeKeys);

	$scope.globalAttributes = {};
	$scope.idDocuments = {};
	$scope.proofOfAddresses = {};
	$scope.proofOfWealthes = {};
	$scope.title = title || 'Add Attribute';
	//$scope.onlineIdentityAttributes = {};

	let data = SqlLiteService.getIdAttributeTypes();

	for (let i in data) {
		if (excludeKeys.indexOf(data[i].key) !== -1 || data[i].type !== type) continue;
		switch (data[i].category) {
			case 'global_attribute':
				$scope.globalAttributes[i] = data[i];
				break;
			case 'id_document':
				$scope.idDocuments[i] = data[i];
				break;
			case 'proof_of_address':
				$scope.proofOfAddresses[i] = data[i];
				break;
			case 'proof_of_wealth':
				$scope.proofOfWealthes[i] = data[i];
				break;
		}
	}

	$scope.getLength = obj => {
		return Object.keys(obj).length;
	};

	$scope.item = {};

	$scope.save = event => {
		if ($scope.selectedKey) {
			$mdDialog.hide(data[$scope.selectedKey]);
		}
	};

	$scope.cancel = event => {
		$mdDialog.cancel();
	};

	$scope.$on('selfkey:on-keypress', (event, key) => {
		if (key == 'Enter') {
			$scope.save(event);
		}
	});

	$scope.ignoreEnterKey = event => {
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();

		$scope.save(event);

		return;
	};
}

AddIdAttributeDialogController.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$mdDialog',
	'SqlLiteService',
	'excludeKeys',
	'type',
	'title'
];
module.exports = AddIdAttributeDialogController;
