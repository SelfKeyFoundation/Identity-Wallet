'use strict';

function AddEditStaticDataDialogController(
	$rootScope,
	$scope,
	$log,
	$q,
	$mdDialog,
	CommonService,
	SqlLiteService,
	RPCService,
	mode,
	idAttributeType,
	idAttribute
) {
	'ngInject';

	$log.info('AddEditStaticDataDialogController');

	const INITIAL_ID_ATTRIBUTES = [
		'first_name',
		'last_name',
		'middle_name',
		'country_of_residency',
		'id_selfie',
		'national_id',
		'email'
	];
	const ADDRESS_ID_ATTRIBUTES = ['physical_address', 'work_place'];
	const COUNTRY_ID_ATTRIBUTES = ['nationality', 'country_of_residency'];
	const DATE_ID_ATTRIBUTES = ['birthdate'];
	const TELEPHONE_ID_ATTRIBUTES = ['phonenumber_countrycode'];

	$scope.currentDate = new Date();
	$scope.idAttribute = idAttribute;
	$scope.idAttributeType = idAttributeType;
	$scope.countryList = SqlLiteService.getCountries();
	$scope.singleInputType = 'text';

	if (idAttributeType === 'email') {
		$scope.singleInputType = 'email';
	}

	$scope.theForm = null;

	$scope.inputs = {};

	prepare();

	$scope.close = event => {
		$mdDialog.cancel();
	};

	$scope.isFormInvalid = theForm => {
		$scope.theForm = theForm;
		return !$scope.theForm.$valid;
	};

	$scope.getFormPath = () => {
		if (ADDRESS_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			return 'common/dialogs/id-attributes/forms/address.html';
		} else if (COUNTRY_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			return 'common/dialogs/id-attributes/forms/country.html';
		} else if (DATE_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			return 'common/dialogs/id-attributes/forms/birth-date.html';
		} else if (TELEPHONE_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			return 'common/dialogs/id-attributes/forms/phone-number.html';
		} else {
			return 'common/dialogs/id-attributes/forms/static-data.html';
		}
	};

	$scope.save = (event, theForm) => {
		if (!theForm.$valid || $scope.savePromise) return;

		let value = {
			staticData: {}
		};

		if (ADDRESS_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			value.staticData.line1 = $scope.inputs.line1;
			value.staticData.line2 = $scope.inputs.line2;
			value.staticData.line3 = $scope.inputs.line3;
			value.staticData.line4 = $scope.inputs.line4;
			value.staticData.line5 = $scope.inputs.line5;
			value.staticData.line6 = $scope.inputs.line6;
		} else if (COUNTRY_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			value.staticData.line1 = $scope.inputs.line1;
		} else if (DATE_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			value.staticData.line1 = $scope.inputs.line1.getTime();
		} else if (TELEPHONE_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			value.staticData.line1 = $scope.inputs.line1;
			value.staticData.line2 = $scope.inputs.line2;
		} else {
			value.staticData.line1 = $scope.inputs.line1;
		}

		if (mode === 'create') {
			$scope.savePromise = RPCService.makeCall('addIdAttribute', {
				walletId: $rootScope.wallet.id,
				idAttributeType: idAttributeType,
				staticData: value.staticData,
				file: null
			});
		} else {
			$scope.savePromise = RPCService.makeCall('addEditStaticDataToIdAttributeItemValue', {
				idAttributeId: idAttribute.id,
				idAttributeItemId: idAttribute.items[0].id,
				idAttributeItemValueId: idAttribute.items[0].values[0].id,
				staticData: value.staticData
			});
		}

		$scope.savePromise
			.then(data => {
				$mdDialog.hide($scope.inputs);
			})
			.catch(error => {
				CommonService.showToast('error', 'error');
			});
	};

	$scope.showErrorToast = input => {
		if (input.length == 0) {
			CommonService.showToast(
				'error',
				'This field is required. Please enter ' + $scope.idAttributeType
			);
		}
	};

	function prepare() {
		if (mode === 'create') return;

		let idAttributeItemValue = idAttribute.items[0].values[0];
		if (!idAttributeItemValue || !idAttributeItemValue.staticData) {
			return;
		}

		$scope.inputs.line1 = angular.copy(idAttributeItemValue.staticData.line1);

		if (ADDRESS_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			$scope.inputs.line2 = angular.copy(idAttributeItemValue.staticData.line2);
			$scope.inputs.line3 = angular.copy(idAttributeItemValue.staticData.line3);
			$scope.inputs.line4 = angular.copy(idAttributeItemValue.staticData.line4);
			$scope.inputs.line5 = angular.copy(idAttributeItemValue.staticData.line5);
			$scope.inputs.line6 = angular.copy(idAttributeItemValue.staticData.line6);
		} else if (DATE_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			$scope.inputs.line1 = new Date(idAttributeItemValue.staticData.line1);
		} else if (TELEPHONE_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			$scope.inputs.line2 = idAttributeItemValue.staticData.line2;
		}
	}

	$scope.$on('selfkey:on-keypress', (event, key) => {
		if (key == 'Enter') {
			$scope.save(event, $scope.theForm);
		}
	});

	$scope.ignoreEnterKey = event => {
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();

		$scope.save(event, $scope.theForm);
		return;
	};
}

AddEditStaticDataDialogController.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$q',
	'$mdDialog',
	'CommonService',
	'SqlLiteService',
	'RPCService',
	'mode',
	'idAttributeType',
	'idAttribute'
];
module.exports = AddEditStaticDataDialogController;
