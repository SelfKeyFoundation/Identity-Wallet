const Token = requireAppModule('angular/classes/token');

function AddEditCustomTokenDialogController($rootScope, $scope, $log, $q, $timeout, $mdDialog, SqlLiteService, Web3Service, CommonService) {
    'ngInject'

    $log.info('AddCustomTokenDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.walletTokens = [];
    let wallet = $rootScope.wallet;

    wallet.loadTokens().then((tokens) => {
        tokens = tokens || {};
        $scope.walletTokens = Object.keys(tokens).map((tokenKey) => {
            let token = tokens[tokenKey];
            let walletToken = wallet.tokens[token.symbol.toUpperCase()];
            token.totalValue = walletToken.calculateBalanceInUSD();

            let lastPrice = SqlLiteService.getTokenPriceBySymbol(token.symbol.toUpperCase());
            token.lastPrice = lastPrice ? lastPrice.priceUSD : 0;
            token.balance = walletToken.getFormattedBalance();
            return token;
        });

        let ethPrice = SqlLiteService.getTokenPriceBySymbol('ETH');
        $scope.walletTokens.push({
            symbol: 'ETH',
            lastPrice: ethPrice ? ethPrice.priceUSD : 0,
            balance: wallet.getFormattedBalance(),
            totalValue: wallet.calculateBalanceInUSD(),
            contractAddress: '0x' + wallet.publicKeyHex
        });

        $scope.walletTokens.sort((a, b) => {
            let symbolA = a.symbol.toLowerCase();
            let symbolB = b.symbol.toLowerCase();
            if (symbolA == 'eth') {
                return -1;
            }

            if (symbolB == 'eth') {
                return 1;
            }

            if (symbolA == 'key') {
                return -1;
            }

            if (symbolB == 'key') {
                return 1;
            }

            return parseFloat(b.totalValue || 0) - parseFloat(a.totalValue || 0);
        });
    });


    const PRIMARY_TOKEN_KEYS = ['KEY', 'ETH'];
    $scope.isDeletable = (token) => {
        if (PRIMARY_TOKEN_KEYS.indexOf(token.symbol.toUpperCase()) != -1) {
            return false;
        }
        return true;
    };

    $scope.deleteCustomToken = (token, index) => {

        SqlLiteService.updateWalletToken({
            tokenId: token.id,
            walletId: wallet.id,
            id: token.walletTokenId,
            balance: token.balance,
            recordState: 0
        }).then(() => {
            $rootScope.wallet.loadTokens().then(()=> {
                $rootScope.$broadcast("piechart:reload");
            });
            $scope.walletTokens.splice(index, 1);
        });

    }
};

module.exports = AddEditCustomTokenDialogController;
