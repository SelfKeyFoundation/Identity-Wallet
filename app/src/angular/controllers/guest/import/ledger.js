'use strict';

const Wallet = requireAppModule('angular/classes/wallet');

function GuestImportLedgerController($rootScope, $scope, $log, $q, $timeout, $state, RPCService, CommonService, SqlLiteService) {
    'ngInject'

    $log.info('GuestImportLedgerController');
};

module.exports = GuestImportLedgerController;
