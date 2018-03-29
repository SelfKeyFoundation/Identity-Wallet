'use strict';

function SelfkeyService($rootScope, $log, $http, CONFIG) {
    'ngInject';

    $log.info('SelfkeyService Initialized');

    // 'https://token-sale-demo-api.kyc-chain.com';
    const KYC_BASE_URL = CONFIG.kycApiEndpoint;

    /**
     *
     */
    class SelfkeyService {

        constructor() {
        }

        /**
         *
         */
        triggerAirdrop(airdropCode) {
            return $http.post(KYC_BASE_URL + "/airdrop", { exportCode: airdropCode, ethAddress: "0x" + $rootScope.wallet.publicKeyHex });
        }
    };

    return new SelfkeyService();
}

module.exports = SelfkeyService;
