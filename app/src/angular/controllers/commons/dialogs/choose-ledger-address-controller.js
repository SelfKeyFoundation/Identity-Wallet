'use strict';
const Wallet = requireAppModule('angular/classes/wallet');

function ChooseLedgerAddressController($rootScope, $scope, $log, $q, $state, $mdDialog, CommonService, LedgerService, baseAccounts, ACCOUNTS_QUENTITY_PER_PAGE) {
  'ngInject'
  $scope.currentAccounts = baseAccounts;
  $scope.selectedAccount = null;
  $scope.pagerStart = 0;

  $scope.cancel = () => {
    $mdDialog.cancel();
  };

  let onError = () => {
    CommonService.showToast('error', 'error');
  };
  let resetLoadingStatuses = () => {
    $scope.loadingBalancesIsInProgress = {
      next: false,
      previous: false,
      any: false
    };
  };

  resetLoadingStatuses();

  $scope.getAccountsWithBalances = (isNext) => {
    if ($scope.loadingBalancesIsInProgress.any) {
      return;
    }

    $scope.loadingBalancesIsInProgress.any = true;
    if (isNext) {
      $scope.loadingBalancesIsInProgress.next = true;
    } else {
      $scope.loadingBalancesIsInProgress.previous = true;
    }

    let newStart = isNext ? $scope.pagerStart + ACCOUNTS_QUENTITY_PER_PAGE : $scope.pagerStart - ACCOUNTS_QUENTITY_PER_PAGE;
    if (newStart < 0) {
      newStart = 0;
    }
    LedgerService.getAccountsWithBalances({ start: newStart, quantity: ACCOUNTS_QUENTITY_PER_PAGE }).then((accounts) => {
      accounts = accounts || [];
      $scope.currentAccounts = accounts;
      $scope.selectedAccount = null;
      $scope.pagerStart = newStart;
      resetLoadingStatuses();
    }).catch(err => {
      resetLoadingStatuses();
      onError();
    });

  };

  let nextStep = (isSetupFinished) => {
    $scope.cancel();
    if (isSetupFinished) {
      $state.go('member.dashboard.main');
    } else {
      $state.go('guest.loading', { redirectTo: 'guest.create.step-5' });
    }
  };

  $scope.chooseAccount = () => {
    let selectedAccount = $scope.selectedAccount;
    if (!selectedAccount) {
      return;
    }

    let address = selectedAccount.address;
    if (address.substring(0, 2) == '0x') {
      address = address.substring(2, address.length);
    }

    let importPromise = LedgerService.createWalletByAddress(address);
    importPromise.then((data) => {
      if (data.id) {
        $rootScope.wallet = new Wallet(data.id, null, data.publicKey, null, data.profile);

        let initialPromises = [];
        initialPromises.push($rootScope.wallet.loadIdAttributes());
        initialPromises.push($rootScope.wallet.loadTokens());

        $q.all(initialPromises).then((resp) => {
          $rootScope.selectedLedgerAccount = selectedAccount;
          nextStep(data.isSetupFinished);
        }).catch((error) => {
          CommonService.showToast('error', 'error');
        });
      } else {
        CommonService.showToast('error', 'error');
      }
    }).catch((error) => {
      CommonService.showToast('error', 'error');
    });

  };

};

module.exports = ChooseLedgerAddressController;
