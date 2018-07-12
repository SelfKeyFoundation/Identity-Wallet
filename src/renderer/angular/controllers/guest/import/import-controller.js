const { Logger } = require('common/logger');
const log = new Logger('GuestImportWalletController');
function GuestImportWalletController($rootScope, $scope, $state, SqlLiteService) {
	'ngInject';

	log.debug('GuestImportWalletController');

	$scope.selectedOption = 'keystoreSelect';

	$scope.publicKeyList = SqlLiteService.getWalletPublicKeys();

	if ($scope.publicKeyList.length <= 0) {
		$scope.selectedOption = 'keystoreImport';
		$state.go('guest.import.keystore', { type: 'import' });
	}

	$scope.options = [
		{
			title: 'Import New Address',
			subTitle: '(Keystore File)',
			icon: 'import-keystore',
			value: 'keystoreImport',
			disabled: false
		},
		{
			title: 'Ledger',
			icon: 'ledger',
			value: 'ledger',
			disabled: false
		},
		{
			title: 'Private Key',
			icon: 'private-keys',
			value: 'privateKey',
			disabled: false
		},
		{
			title: 'TREZOR',
			subTitle: '(Coming Soon)',
			icon: 'trezor',
			value: 'trezor',
			disabled: true
		}
	];

	if ($scope.publicKeyList.length > 0) {
		$scope.options.unshift({
			title: 'Select Existing Address',
			subTitle: '(Keystore File)',
			icon: 'existing-keystore',
			value: 'keystoreSelect',
			disabled: false
		});
	}

	$scope.onRadioButtonChange = event => {
		log.debug('onRadioButtonChange, %s', $scope.selectedOption);

		switch ($scope.selectedOption) {
			case 'keystoreSelect':
				$state.go('guest.import.keystore', { type: 'select' });
				break;
			case 'keystoreImport':
				$state.go('guest.import.keystore', { type: 'import' });
				break;
			case 'privateKey':
				$state.go('guest.import.private-key');
				break;
			case 'ledger':
				$state.go('guest.import.ledger');
				break;
			default:
				$state.go('guest.import.keystore', { type: 'select' });
		}
	};
}
GuestImportWalletController.$inject = ['$rootScope', '$scope', '$state', 'SqlLiteService'];
module.exports = GuestImportWalletController;
