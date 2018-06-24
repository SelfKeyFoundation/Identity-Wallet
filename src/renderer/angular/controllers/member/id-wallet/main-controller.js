'use strict';

function MemberIdWalletMainController(
	$rootScope,
	$scope,
	$log,
	$timeout,
	$mdDialog,
	$mdPanel,
	SqlLiteService,
	CommonService,
	RPCService
) {
	'ngInject';

	$log.info('MemberIdWalletMainController');

	let ID_ATTRIBUTE_TYPES = {};
	let excludeKeys = [];

	$scope.initialIdAttributes = [
		'first_name',
		'last_name',
		'middle_name',
		'country_of_residency',
		'id_selfie',
		'national_id',
		'email'
	];

	$scope.attributesList = [];
	$scope.idDocumentsList = [];
	$scope.walletHistoryList = [];

	SqlLiteService.loadIdAttributeTypes();

	prepareData();
	loadWalletHistory();

	/**
	 *
	 */
	$scope.addIdAttribute = (event, type, title) => {
		$mdDialog
			.show({
				controller: 'AddIdAttributeDialogController',
				templateUrl: 'common/dialogs/id-attributes/add-id-attribute.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: false,
				fullscreen: true,
				locals: {
					excludeKeys: excludeKeys,
					type,
					title
				}
			})
			.then(selectedIdAttributeType => {
				// part 1
				// $rootScope.wallet.id
				// selectedIdAttributeType.key

				if (selectedIdAttributeType.type === 'document') {
					$rootScope
						.openAddEditDocumentDialog(
							event,
							'create',
							selectedIdAttributeType.key,
							null
						)
						.then(() => {
							prepareData();
							CommonService.showToast('success', 'saved');

							SqlLiteService.registerActionLog(
								'Created Document: ' +
									$rootScope.DICTIONARY[selectedIdAttributeType.key],
								'Created'
							).then(() => {
								loadWalletHistory();
							});
						});
				} else {
					$rootScope
						.openAddEditStaticDataDialog(
							event,
							'create',
							selectedIdAttributeType.key,
							null
						)
						.then(() => {
							prepareData();
							CommonService.showToast('success', 'saved');

							SqlLiteService.registerActionLog(
								'Created Attribute: ' +
									$rootScope.DICTIONARY[selectedIdAttributeType.key],
								'Created'
							).then(() => {
								loadWalletHistory();
							});
						});
				}
			});
	};

	$scope.editIdAttributeItemValue = (event, idAttribute, idAttributeType) => {
		$rootScope
			.openAddEditStaticDataDialog(event, 'update', idAttributeType, idAttribute)
			.then(() => {
				prepareData();
				CommonService.showToast('success', 'saved');

				SqlLiteService.registerActionLog(
					'Updated Attribute: ' + $rootScope.DICTIONARY[idAttributeType],
					'Updated'
				).then(() => {
					loadWalletHistory();
				});
			});
	};

	$scope.editIdAttributeItemDocument = (event, idAttribute, idAttributeType) => {
		$rootScope
			.openAddEditDocumentDialog(event, 'update', idAttributeType, idAttribute)
			.then(() => {
				prepareData();
				CommonService.showToast('success', 'saved');

				SqlLiteService.registerActionLog(
					'Updated Document: ' + $rootScope.DICTIONARY[idAttributeType],
					'Updated'
				).then(() => {
					loadWalletHistory();
				});
			});
	};

	$scope.openValueDeletePanel = (event, idAttribute) => {
		let itemElement = event.target.parentElement.parentElement;

		let position = $mdPanel
			.newPanelPosition()
			.relativeTo(angular.element(itemElement))
			.addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.ABOVE);

		let config = {
			attachTo: angular.element(document.body),
			targetEvent: event,
			templateUrl: 'common/panels/id-attribute-delete-panel.html',
			clickOutsideToClose: true,
			escapeToClose: true,
			position: position,
			controller: itemValueDeletePanel,
			locals: {
				idAttribute: idAttribute
			}
		};

		$mdPanel.open(config);
	};

	$scope.openFilePreview = (event, item) => {
		if (item && item.documentId) {
			RPCService.makeCall('openFileViewer', { documentId: item.documentId });
		} else {
			CommonService.showToast('error', 'documentId is missing');
		}
	};

	$scope.$on('id-attribute:changed', () => {
		prepareData();
		loadWalletHistory();
	});

	$scope.$on(
		'id-attribute:open-document-add-dialog',
		(event, idAttributeItemValue, idAttributeType) => {
			$scope.editIdAttributeItemDocument(null, idAttributeItemValue, idAttributeType);
		}
	);

	function prepareData() {
		$rootScope.wallet.loadIdAttributes().then(() => {
			$scope.attributesList = [];
			$scope.idDocumentsList = [];

			ID_ATTRIBUTE_TYPES = SqlLiteService.getIdAttributeTypes();
			$scope.idAttributesList = $rootScope.wallet.getIdAttributes();

			if ($scope.idAttributesList) {
				angular.forEach($scope.idAttributesList, item => {
					if (ID_ATTRIBUTE_TYPES[item.idAttributeType].type === 'document') {
						$scope.idDocumentsList.push(item);
					} else if (ID_ATTRIBUTE_TYPES[item.idAttributeType].type === 'static_data') {
						if (
							item.items[0].values[0].staticData &&
							item.items[0].values[0].staticData.line1 &&
							item.idAttributeType == 'birthdate'
						) {
							item.longDateValue = Number(item.items[0].values[0].staticData.line1);
						}
						$scope.attributesList.push(item);
					}
				});
			}

			excludeKeys = [];
			for (let i in $scope.idAttributesList) {
				excludeKeys.push($scope.idAttributesList[i].idAttributeType);
			}

			$rootScope.$broadcast('sk-user-info-box:update');
		});
	}

	function loadWalletHistory() {
		SqlLiteService.loadWalletHistory($rootScope.wallet.id).then(data => {
			$scope.walletHistoryList = data.reverse();
		});
	}

	if ($rootScope.wallet.hasJustActivated) {
		$rootScope.wallet.hasJustActivated = false;
		$timeout(() => {
			$mdDialog.show({
				controller: 'IdWalletInfoController',
				templateUrl: 'common/dialogs/id-wallet-info.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				fullscreen: true,
				escapeToClose: false,
				locals: {}
			});
		}, 1000);
	}
}

function itemValueDeletePanel(
	$rootScope,
	$scope,
	$log,
	mdPanelRef,
	CommonService,
	SqlLiteService,
	RPCService,
	idAttribute
) {
	'ngInject';

	$scope.promise = null;

	$scope.delete = event => {
		$scope.promise = RPCService.makeCall('deleteIdAttribute', {
			idAttributeId: idAttribute.id,
			idAttributeItemId: idAttribute.items[0].id,
			idAttributeItemValueId: idAttribute.items[0].values[0].id
		});
		$scope.promise.then(() => {
			let idAttributeTypes = SqlLiteService.getIdAttributeTypes();
			let actionText =
				idAttributeTypes[idAttribute.idAttributeType].type === 'document'
					? 'Document'
					: 'Attribute';
			SqlLiteService.registerActionLog(
				'Deleted ' + actionText + ': ' + $rootScope.DICTIONARY[idAttribute.idAttributeType],
				'Deleted'
			).then(() => {
				$rootScope.$broadcast('id-attribute:changed');
				CommonService.showToast('success', 'deleted');
				mdPanelRef.close().then(() => {
					mdPanelRef.destroy();
				});
			});
		});
	};

	$scope.cancel = event => {
		mdPanelRef.close().then(() => {
			mdPanelRef.destroy();
		});
	};
}
itemValueDeletePanel.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'mdPanelRef',
	'CommonService',
	'SqlLiteService',
	'RPCService',
	'idAttribute'
];

MemberIdWalletMainController.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$timeout',
	'$mdDialog',
	'$mdPanel',
	'SqlLiteService',
	'CommonService',
	'RPCService'
];
module.exports = MemberIdWalletMainController;
