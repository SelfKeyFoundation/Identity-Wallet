'use strict';
const Wallet = require('../../../classes/wallet');

function ConfirmLedgerTransactionWarningController($rootScope, $scope, $log, $q, $state, $mdDialog) {
  'ngInject'

  $scope.cancel = () => {
    $mdDialog.cancel();
  };
};

ConfirmLedgerTransactionWarningController.$inject = ["$rootScope", "$scope", "$log", "$q", "$state", "$mdDialog"];
module.exports = ConfirmLedgerTransactionWarningController;
