function AddEditCustomTokenDialogController($rootScope, $scope, $log, $q, $timeout, $mdDialog) {
  'ngInject'

  $log.info('AddCustomTokenDialogController');

  $scope.cancel = (event) => {
      $mdDialog.cancel();
  }

  $scope.formDataIsValid = (form) => {
      return form.$valid;
  };

  $scope.customTokens = [];//TODO 

 
  let sortCustomTokens = () => {
      $scope.customTokens.sort((a, b) => {
          let key = 'totalValue';
          return parseFloat(b[key]) - parseFloat(a[key]);
      });
  };

  sortCustomTokens();

  $scope.formData = {
      decimalPlaces: null,
      symbol: '',
      tokenAddress: ''
  };

  $scope.isDeletable = (token) =>{
      return token.isDeletable;
  };

  $scope.deleteCustomToken = (token, index) => {
    //TODO
  }
  
  $scope.addCustomToken = (event, form) => {
      if (!$scope.formDataIsValid(form)) {
          return;
      }

      let newToken = $scope.formData;

      let isDublicateKey = currentTokensKeys.indexOf(newToken.symbol) != -1; 
      if (isDublicateKey) {
          //TODO tato
          return;
      }
      //TODO
  }
};

module.exports = AddEditCustomTokenDialogController;