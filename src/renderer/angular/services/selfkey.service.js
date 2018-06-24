'use strict';

function SelfkeyService($rootScope, $log, $http, CONFIG) {
	'ngInject';

	$log.info('SelfkeyService Initialized');

	//const KYC_BASE_URL = CONFIG.kycApiEndpoint;
	const KYC_BASE_URL = 'https://token-sale-demo-api.kyc-chain.com';

	/**
	 *
	 */
	class SelfkeyService {
		constructor() {}

		/**
		 *
		 */
		triggerAirdrop(airdropCode) {
			return $http.post(KYC_BASE_URL + '/airdrop', {
				exportCode: airdropCode,
				ethAddress: '0x' + $rootScope.wallet.publicKeyHex
			});
		}
	}

	return new SelfkeyService();
}
SelfkeyService.$inject = ['$rootScope', '$log', '$http', 'CONFIG'];
module.exports = SelfkeyService;
