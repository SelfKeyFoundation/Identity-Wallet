/* global angular */
'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('add-edit-static-data-ctl');

function AddEditStaticDataDialogController(
	$rootScope,
	$scope,
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

	log.info('AddEditStaticDataDialogController');

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

		let attr = {
			data: {}
		};

		if (ADDRESS_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			attr.data.address1 = $scope.inputs.line1;
			attr.data.address2 = $scope.inputs.line2;
			attr.data.city = $scope.inputs.line3;
			attr.data.region = $scope.inputs.line4;
			attr.data.zip = $scope.inputs.line5;
			attr.data.country = $scope.inputs.line6;
		} else if (COUNTRY_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			attr.data.value = $scope.inputs.line1;
		} else if (DATE_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			attr.data.value = $scope.inputs.line1.getTime();
		} else if (TELEPHONE_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			attr.data.countryCode = $scope.inputs.line1;
			attr.data.telephoneNumber = $scope.inputs.line2;
		} else {
			attr.data.value = $scope.inputs.line1;
		}

		if (mode === 'create') {
			$scope.savePromise = RPCService.makeCall('addIdAttribute', {
				walletId: $rootScope.wallet.id,
				type: idAttributeType,
				data: attr.data,
				document: null
			});
		} else {
			$scope.savePromise = RPCService.makeCall('addEditStaticDataToIdAttributeItemValue', {
				idAttributeId: idAttribute.id,
				data: attr.data
			});
		}

		$scope.savePromise
			.then(data => {
				$mdDialog.hide($scope.inputs);
			})
			.catch(error => {
				log.error(error);
				CommonService.showToast('error', 'error');
			});
	};

	$scope.showErrorToast = input => {
		if (input.length === 0) {
			CommonService.showToast(
				'error',
				'This field is required. Please enter ' + $scope.idAttributeType
			);
		}
	};

	function prepare() {
		if (mode === 'create') return;

		$scope.inputs.line1 = angular.copy(idAttribute.data.value);

		if (ADDRESS_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			$scope.inputs.line1 = angular.copy(idAttribute.data.address1);
			$scope.inputs.line2 = angular.copy(idAttribute.data.address2);
			$scope.inputs.line3 = angular.copy(idAttribute.data.city);
			$scope.inputs.line4 = angular.copy(idAttribute.data.region);
			$scope.inputs.line5 = angular.copy(idAttribute.data.zip);
			$scope.inputs.line6 = angular.copy(idAttribute.data.country);
		} else if (DATE_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			$scope.inputs.line1 = new Date(idAttribute.data.value);
		} else if (TELEPHONE_ID_ATTRIBUTES.indexOf(idAttributeType) !== -1) {
			$scope.inputs.line2 = idAttribute.data.value;
		}
	}

	$scope.$on('selfkey:on-keypress', (event, key) => {
		if (key === 'Enter') {
			$scope.save(event, $scope.theForm);
		}
	});

	$scope.ignoreEnterKey = event => {
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();

		$scope.save(event, $scope.theForm);
	};
}

AddEditStaticDataDialogController.$inject = [
	'$rootScope',
	'$scope',
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
