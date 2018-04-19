'use strict';

const Token = requireAppModule('angular/classes/token');

function ManageCryptosController($rootScope, $scope, $log, $q, $timeout, $mdDialog, $state, SqlLiteService, Web3Service, CommonService) {
    'ngInject'

    $log.info('ManageCryptosController');

    let reloadPieChartIsNeeded = false;
    $scope.cancel = (event) => {
        $state.go('member.dashboard.main');
        if (reloadPieChartIsNeeded) {
            $rootScope.$broadcast("piechart:reload");
        }
    }

    $scope.data = [];
    let wallet = $rootScope.wallet;

    let processTokens = (walletTokens) => {
        let data = Object.keys(walletTokens).map((tokenKey) => {
            let walletToken = walletTokens[tokenKey];
            let roundedBalanceUSD = walletToken.calculateBalanceInUSD() > 0 ? walletToken.calculateBalanceInUSD().toFixed(2) : walletToken.calculateBalanceInUSD();
            let roundedFormattedBalance = Number(walletToken.getFormattedBalance()) > 0 && !CommonService.isInt(Number(walletToken.getFormattedBalance())) ? Number(walletToken.getFormattedBalance()).toFixed(2) : Number(walletToken.getFormattedBalance());

            walletToken.totalValue = CommonService.commasAfterNumber(roundedBalanceUSD, 2);

            let lastPrice = SqlLiteService.getTokenPriceBySymbol(walletToken.symbol.toUpperCase());
            walletToken.lastPrice = lastPrice ? lastPrice.priceUSD : 0;
            walletToken.balance = CommonService.commasAfterNumber(roundedFormattedBalance, 2);
            walletToken.name = SqlLiteService.getTokenPriceBySymbol(tokenKey).name;

            return walletToken;
        });

        let ethPrice = SqlLiteService.getTokenPriceBySymbol('ETH');
        let ethRoundedFormattedBalance = Number(wallet.getFormattedBalance()) > 0 && !CommonService.isInt(Number(wallet.getFormattedBalance())) ? Number(wallet.getFormattedBalance()).toFixed(2) : Number(wallet.getFormattedBalance());
        let ethRoundedBalanceUSD = wallet.calculateBalanceInUSD() > 0 ? wallet.calculateBalanceInUSD().toFixed(2) : wallet.calculateBalanceInUSD();

        data.push({
            symbol: 'ETH',
            name: 'Ethereum',
            lastPrice: ethPrice ? ethPrice.priceUSD : 0,
            balance: CommonService.commasAfterNumber(ethRoundedFormattedBalance, 2),
            totalValue: CommonService.commasAfterNumber(ethRoundedBalanceUSD, 2),
            contractAddress: ''
        });
        data.sort((a, b) => {
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

        $scope.data = data;

    };

    processTokens(wallet.tokens);

    const PRIMARY_TOKEN_KEYS = ['KEY', 'ETH'];
    $scope.isDeletable = (token) => {
        if (PRIMARY_TOKEN_KEYS.indexOf(token.symbol.toUpperCase()) != -1) {
            return false;
        }
        return true;
    };


    $scope.deleteCustomToken = (event, token, index) => {
        $rootScope.openConfirmationDialog(event, 'Hiding tokens from this list only disables them from the display, and does not impact their status on the Ethereum blockchain.\n').then((val) => {
            if (val == 'accept') {
                SqlLiteService.updateWalletToken({
                    tokenId: token.id,
                    walletId: wallet.id,
                    id: token.walletTokenId,
                    balance: token.balance,
                    recordState: 0
                }).then(() => {
                    delete $rootScope.wallet.tokens[token.symbol.toUpperCase()];
                    $scope.data.splice(index, 1);
                    reloadPieChartIsNeeded = true;
                });
            }
        });

    }
};

module.exports = ManageCryptosController;
