'use strict';

function MemberSetupAddDocumentController(
	$rootScope,
	$scope,
	$log,
	$state,
	$timeout,
	$stateParams,
	CommonService,
	RPCService,
	SqlLiteService
) {
	'ngInject';

	$log.info('MemberSetupAddDocumentController');

	$scope.idAttributes = $rootScope.wallet.getIdAttributes();

	const ID_ATTRIBUTES = {
		national_id: {
			type: 'national_id',
			step: 'STEP 3',
			title1: 'Upload Your National ID',
			title2: "(Can be a driver's license or passport)",
			title3: '(Max file size: 50mb)'
		},
		id_selfie: {
			type: 'id_selfie',
			step: 'STEP 4',
			title1: 'Upload Your National ID Selfie',
			title2: '(A selfie photo of you holding your National ID)',
			title3: 'This is stored locally. Max file size 50mb.'
		}
	};

	$scope.selected = ID_ATTRIBUTES[$stateParams.type];
	$scope.selected.values = $rootScope.wallet.getIdAttributeItemValue($scope.selected.type);

	$scope.nextStep = event => {
		goToNextStep();
	};

	$scope.snackbar = function(status, message, isShown) {
		this.status = status;
		this.message = message;
		this.isShown = isShown;
		// Fade out
		/*   $timeout(function () {
            isShown = false;
            $scope.isShown = false;
        }, 3000);*/
	};

	$scope.selectFile = event => {
		let selectedValue = $scope.idAttributes[$scope.selected.type].items[0].values[0];
		let actionText = 'Created Document: ';
		let actionTitle = 'Created';
		if (selectedValue.documentId) {
			actionText = 'Updated Document: ';
			actionTitle = 'Updated';
		}

		let args = {
			idAttributeId: $scope.idAttributes[$scope.selected.type].id,
			idAttributeItemId: $scope.idAttributes[$scope.selected.type].items[0].id,
			idAttributeItemValueId: $scope.idAttributes[$scope.selected.type].items[0].values[0].id
		};

		let addDocumentPromise = RPCService.makeCall('openDocumentAddDialog', args);
		addDocumentPromise
			.then(resp => {
				if (!resp) return;

				$rootScope.wallet.loadIdAttributes().then(resp => {
					$scope.idAttributes = $rootScope.wallet.getIdAttributes();
					//CommonService.showToast('success', 'File successfully saved.');
					$scope.snackbar('success', 'File successfully saved.', true);
					$scope.selected.values = 'Saved!';

					SqlLiteService.registerActionLog(
						actionText + $rootScope.DICTIONARY[$stateParams.type],
						actionTitle
					);

					//goToNextStep();
				});
			})
			.catch(error => {
				//CommonService.showToast('error', 'File size is over 50MB. Please upload a smaller file.');
				$scope.snackbar(
					'error',
					'File size is over 50MB. Please upload a smaller file.',
					true
				);
			});
	};

	$scope.skip = event => {
		$state.go('member.dashboard.main');
	};

	function goToNextStep() {
		if ($stateParams.type === 'national_id') {
			$state.go('member.setup.add-document', { type: 'id_selfie' });
		} else {
			$state.go('member.id-wallet.main');
		}
	}
}
MemberSetupAddDocumentController.$inject = [
	'$rootScope',
	'$scope',
	'$log',
	'$state',
	'$timeout',
	'$stateParams',
	'CommonService',
	'RPCService',
	'SqlLiteService'
];
module.exports = MemberSetupAddDocumentController;
