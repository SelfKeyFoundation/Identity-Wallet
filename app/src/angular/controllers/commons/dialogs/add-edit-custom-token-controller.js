const Token = requireAppModule('angular/classes/token');

function AddEditCustomTokenDialogController($rootScope, $scope, $log, $q, $timeout, $mdDialog, SqlLiteService, Web3Service, CommonService) {
    'ngInject'

    $log.info('AddCustomTokenDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.inProgress = false;
    $scope.formDataIsValid = (form) => {
        return form.$valid;
    };

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
    let wallet = $rootScope.wallet;

    wallet.loadTokens().then((tokens) => {
        tokens = tokens || {};
        $scope.walletTokens = Object.keys(tokens).map((tokenKey) => {
            let token = tokens[tokenKey];
            token.totalValue = wallet.tokens[token.symbol.toUpperCase()].getBalanceDecimal();

            let lastPrice = SqlLiteService.getTokenPriceBySymbol(token.symbol.toUpperCase());
            token.lastPrice = lastPrice ? lastPrice.priceUSD : 0;

            return token;
        });

        let ethPrice = SqlLiteService.getTokenPriceBySymbol('ETH');
        $scope.walletTokens.push({
            symbol: 'ETH',
            lastPrice: ethPrice ? ethPrice.priceUSD : 0,
            balance: wallet.balanceEth,
            contractAddress: '0x' + wallet.publicKeyHex
        });

        $scope.walletTokens.sort((a,b) =>{
            return !(a.symbol == 'ETH' || a.symbol == 'KEY');
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
            $log.error(error);
        }

        let isValidHex = newVal && check
        if (isValidHex) {
            let existingToken = getTokenByContractAddress(newVal);

            if (existingToken) {
                data.symbol = existingToken.symbol;
                data.decimalPlaces = existingToken.decimal;
                data.tokenId = existingToken.id;
            } else {
                CommonService.showToast('success', 'Looking ERC20 Contract into blockchain');
                data.tokenId = '';
                Web3Service.getContractInfo(newVal).then((responseArr) => {
                    if (!responseArr || responseArr.length != 2) {
                        return resetFormData();
                    }

                    let decimal = responseArr[0];
                    let symbol = responseArr[1];

                    data.symbol = symbol;
                    data.decimalPlaces = Number(decimal);
                    data.tokenId = '';

                    CommonService.showToast('success', 'Found Contract: ' + data.symbol);
                }).catch((err) => {
                    resetFormData();
                    CommonService.showToast('warning', 'ERC20 Contract not found');
                });
            }
        } else {
            resetFormData();
        }
    }, true);

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

    let resetFormData = () => {
        let data = $scope.formData;

        data.symbol = '';
        data.decimalPlaces = null;
        data.tokenId = '';
    };

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
            $scope.walletTokens.splice(index, 1);
        });

    }

    $scope.addCustomToken = (event, form) => {
        if (!$scope.formDataIsValid(form)) {
            return CommonService.showToast('warning', "Form isn't valid");
        }

        //todo check dublicate & disable add button while adding is in progress

        let newToken = $scope.formData;
        $scope.inProgress = true;

        Token.getBalanceByContractAddress(newToken.contractAddress, wallet.getPublicKeyHex()).then((balance) => {
            balance = Number(balance);
            let newWalletToken = {
                walletId: wallet.id,
                tokenId: newToken.tokenId,
                balance: balance
            }

            let successFn = (data) => {
                $scope.inProgress = false;
                $scope.cancel();
                $rootScope.openNewERC20TokenInfoDialog(event, 'New ERC-20 Token Added:', newToken.symbol, balance);
                CommonService.showToast('success', "Added");
            };

            let errFn = (err) => {
                $scope.inProgress = false;
                CommonService.showToast('error', err ? err.Error : 'Error');
            }

            if (newToken.tokenId) {
                SqlLiteService.insertWalletToken(newWalletToken).then(successFn).catch(errFn);
            } else {
                newWalletToken.symbol = newToken.symbol;
                newWalletToken.decimal = newToken.decimalPlaces;
                newWalletToken.address = newToken.contractAddress;
                newWalletToken.isCustom = 1;

                delete newWalletToken.tokenId;
                delete newWalletToken.balance;
                delete newWalletToken.walletId;
                SqlLiteService.insertNewWalletToken(newWalletToken, balance, wallet.id).then(successFn).catch(errFn);
            }
        }).catch(err => {
            $scope.inProgress = false;
            return CommonService.showToast('error', err ? err.Error : 'Error');
        });

    }
};

module.exports = AddEditCustomTokenDialogController;
