function ManageTokenController($rootScope, $scope,$state, $log, $mdDialog, $stateParams, TokenService, Web3Service, CommonService, ConfigFileService) {
    'ngInject'

    $log.info("ManageTokenController", $stateParams)

    let temporaryMap = {
        "key": "Selfkey",
        "qey": "Selfkey",
        "eth": "Ethereum"
    }

    $scope.selectedToken = TokenService.getBySymbol($stateParams.id.toUpperCase());

    $scope.publicKeyHex = $rootScope.wallet.getPublicKeyHex();
    $scope.symbol = $stateParams.id.toUpperCase();
    $scope.originalSymbol = $stateParams.id;
    $scope.name = temporaryMap[$scope.symbol];
    
    $scope.balance = 0;
    $scope.balanceUsd = 0;
    
    $rootScope.walletActivityStatuses = $rootScope.walletActivityStatuses || {};
    

    /**
     * 
     */
    prepareBalance ();

    /**
     * 
     */
    function prepareBalance () {
        if ($scope.symbol === 'ETH') {
            // ETHER
            $scope.balance = Number($rootScope.wallet.balanceEth);
            $scope.balanceUsd = CommonService.numbersAfterComma($rootScope.wallet.balanceInUsd, 2);
        } else {
            // TOKEN
            let promise = $scope.selectedToken.loadBalance();
            promise.then((token) => {
                $scope.balance = Number(token.getBalanceDecimal());
                $scope.balanceUsd = CommonService.numbersAfterComma(token.balanceInUsd, 2);
            });
        }
    }

    const selectedChainId = Web3Service.getSelectedChainId();
    const walletNamesMap = {
        '1': {},
        '3': {
            qey: {
                address: '0x603fc6DAA3dBB1e052180eC91854a7D6Af873fdb',
                name: 'SelfKey Token Sale'
            }
        }
    };

    function getWalletName(symbol,address) {
        let chainValue = walletNamesMap[selectedChainId] || {};
        let symbolValue = chainValue[symbol];
        if (symbolValue && symbolValue.address == address) {
            return symbolValue.name;
        }

        return '';
    }
  
    /**
     * 
     */
    $scope.setTokenActivity = () => {
        let store = ConfigFileService.getStore();
       
      
        
        let data = store.wallets[$scope.publicKeyHex].data;
        if (data.activities) {
            let activity = data.activities[$scope.originalSymbol];
            let transactions = activity ? activity.transactions : [];
            

            transactions.forEach(transaction => {
                if (transaction.to) {
                    transaction.nameOfTo = getWalletName($scope.originalSymbol,transaction.to);
                }

                let sendText = transaction.nameOfTo ?  'Sent to' : 'Sent';
                transaction.sentOrReceive =  transaction.to ? sendText : 'Received';                
            });

            debugger;
            $scope.tokenActivity = transactions;
        }
    }

    $scope.setTokenActivity();

    $scope.goToDashboard = () => {
        $state.go('member.dashboard.main');
    }

    /**
     * events
     */
    $rootScope.$on('balance:change', (event, symbol, balance, balanceInUsd) => {
        $log.info('balance:change', symbol, balance, balanceInUsd);
        prepareBalance ();
    });
};

export default ManageTokenController;