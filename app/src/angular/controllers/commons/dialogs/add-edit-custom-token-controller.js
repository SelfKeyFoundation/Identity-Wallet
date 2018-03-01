function AddEditCustomTokenDialogController($rootScope, $scope, $log, $q, $timeout, $mdDialog, SqlLiteService, Web3Service) {
    'ngInject'
  
    $log.info('AddCustomTokenDialogController');
  
    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }
  
    $scope.formDataIsValid = (form) => {
        return form.$valid;
    };
  
    debugger;
    let tokens = SqlLiteService.getTokens() || {};
    let tokenKeys = Object.keys(tokens);
    let allTokensArr = tokenKeys.map((key) => {
        return tokens[key];
    });

    let getTokenByContractAddress = (contractAddress) => {
        return allTokensArr.find((token) => {
            return token.address == contractAddress;
        });
    };

    $scope.walletTokens = [];
    $rootScope.wallet.loadTokens().then((tokens)=> {
      tokens = tokens || {};
      $scope.walletTokens = Object.keys(tokens).map((tokenKey) => {
  
          let token = tokens[tokenKey];
          if (token.symbol.toLowerCase() !== 'eth') {
              token.balance = $rootScope.wallet.tokens[token.symbol.toUpperCase()].getBalanceDecimal();
          } else {
              token.balance = $rootScope.wallet.balanceEth;
          }
  
          return token;
      });
    
    });
  
    const web3Utils = Web3Service.constructor.web3.utils;
      /**
     *
     */
    $scope.$watch('formData.contractAddress', (newVal, oldVal) => {
        let data = $scope.formData;

        let check = false;
        try {
            check = web3Utils.isHex(newVal) && web3Utils.isAddress(web3Utils.toChecksumAddress(newVal));
        } catch (error) {
            console.log(error);
        }

        if (newVal && check) {
            let existingToken = getTokenByContractAddress(newVal);
            data.symbol = existingToken.symbol;
            data.decimalPlaces = existingToken.decimal;
            data.tokenId = existingToken.id;
        } else {
            data.symbol = '';
            data.decimalPlaces = null;
            data.tokenId = '';
        } 
    },true);

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
        contractAddress: '',
        tokenId: ''
    };
  
    const PRIMARY_TOKEN_KEYS = ['KEY','ETH'];
    $scope.isDeletable = (token) =>{
        if (PRIMARY_TOKEN_KEYS.indexOf(token.symbol.toUpperCase() != -1)) {
            return false;
        }
        return true;
    };
  
    $scope.deleteCustomToken = (token, index) => {
      //TODO
    }
    
    $scope.addCustomToken = (event, form) => {
        if (!$scope.formDataIsValid(form)) {
            return;
        }
        //todo check dublicate & disable add button while adding is in progress
        let newToken = $scope.formData;
       
        let newWalletToken = {
            walletId: $rootScope.wallet.id,
            tokenId: newToken.tokenId,
            recordState: 1,
            //TODO balance
        }
        if (newToken.tokenId) {
            SqlLiteService.insertWalletToken(newWalletToken).then((data) => {
                //TODO show success popup
            }).catch((err) => {

            });
        }


        //TODO
    }
  };
  
  module.exports = AddEditCustomTokenDialogController;