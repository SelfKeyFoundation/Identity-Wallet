'use strict';

function LedgerService($rootScope, $window, $q, $timeout, $log, CONFIG, RPCService) {
    'ngInject';

    $log.info('LedgerService Initialized');

    class LedgerService {
        constructor() { }

        connect() {
            return RPCService.makeCall('connectToLedger');
        }

        getAccounts(args) {
            return RPCService.makeCall('getLedgerAccounts', args);
        }

        createWalletByAddress(address) {
            return RPCService.makeCall('createLedgerWalletByAdress', { address });
        }

        signTransaction(dataToSign, address) {
            return RPCService.makeCall('signTransactionWithLedger', {
                dataToSign,
                address
            });
        }
    };

    return new LedgerService();
}

module.exports = LedgerService;
