'use strict';
const { Logger } = require('common/logger');
const log = new Logger('SelfkeyService');
function SelfkeyService($rootScope, $http, CONFIG) {
	'ngInject';

	log.info('SelfkeyService Initialized');

	// const KYC_BASE_URL = CONFIG.kycApiEndpoint;
	const KYC_BASE_URL = 'https://token-sale-demo-api.kyc-chain.com';

	class SelfkeyService {
		triggerAirdrop(airdropCode) {
			return $http.post(KYC_BASE_URL + '/airdrop', {
				exportCode: airdropCode,
				ethAddress: '0x' + $rootScope.wallet.publicKeyHex
			});
		}
	}

	return new SelfkeyService();
}
SelfkeyService.$inject = ['$rootScope', '$http', 'CONFIG'];
module.exports = SelfkeyService;
