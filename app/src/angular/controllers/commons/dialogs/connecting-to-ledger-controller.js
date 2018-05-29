'use strict';

function ConnectingToLedgerController($rootScope, $scope, $log, $q, $state, $mdDialog, CommonService, LedgerService, Web3Service) {
  'ngInject'

  $scope.connectionFailed = false;
  $scope.isConnecting = true;
  const ACCOUNTS_QUENTITY_PER_PAGE = 6;

  $scope.cancelConectToLedger = () => {
    //cancel current sended requests
    $mdDialog.cancel();
  };

  $scope.closeDialog = () => {
    $mdDialog.cancel();
  };

  const onError = () => {
    $scope.isConnecting = false;
    $scope.connectionFailed = true;
  };


  $scope.connectToLedger = () => {
    $scope.connectionFailed = false;
    $scope.isConnecting = true;

    LedgerService.connect().then(() => {
      LedgerService.getAccountsWithBalances({ start: 0, quantity: ACCOUNTS_QUENTITY_PER_PAGE }).then((accounts) => {
        if (!accounts || accounts.length == 0) {
          onError();
          return;
        }

        $scope.closeDialog();
        $rootScope.openChooseLedgerAddressDialog(accounts, ACCOUNTS_QUENTITY_PER_PAGE);
      }).catch(err => {
        onError();
      });

    }).catch((err) => {
      $scope.isConnecting = false;
      $scope.connectionFailed = true;
    });
  };

  $scope.connectToLedger();
};

module.exports = ConnectingToLedgerController;
