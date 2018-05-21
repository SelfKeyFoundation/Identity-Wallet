'use strict';
const Wallet = requireAppModule('angular/classes/wallet');

function ConfirmLedgerTransactionWarningController($rootScope, $scope, $log, $q, $state, $mdDialog) {
  'ngInject'

  $scope.cancel = () => {
    $mdDialog.cancel();
  };
};

module.exports = ConfirmLedgerTransactionWarningController;
