'use strict';

const Token = requireAppModule('angular/classes/token');

function AddCustomTokenDialogController($rootScope, $scope, $log, $q, $timeout, $mdDialog, SqlLiteService, Web3Service, CommonService) {
    'ngInject'

    $log.info('AddCustomTokenDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.inProgress = false;
    $scope.formDataIsValid = (form) => {
        return form.$valid;
    };

    let tokensAreLoaded = false;

    let tokens = SqlLiteService.getTokens() || {};
    let tokenKeys = Object.keys(tokens);
    let allTokensArr = tokenKeys.map((key) => {
        return tokens[key];
    });

    let getTokenByContractAddress = (contractAddress) => {
        return allTokensArr.find((token) => {
            return token.address.toLowerCase() == contractAddress.toLowerCase();
        });
    };

    let getExistingTokenByAddress = (address) => {
        address = address.toLowerCase();
        let tokenKey = Object.keys(wallet.tokens).find((key) => wallet.tokens[key].contractAddress.toLowerCase() == address)
        return tokenKey ? wallet.tokens[tokenKey.toUpperCase()] : null;
    };

    let wallet = $rootScope.wallet;
    const web3Utils = Web3Service.constructor.web3.utils;
    const incorectTokenSymbolsMap = {
        'latoken': 'LA'
    };

    /**
     *
     */
    $scope.$watch('formData.contractAddress', (newVal, oldVal) => {
        let data = $scope.formData;
        let check = false;

        try {
            check = newVal && web3Utils.isHex(newVal) && web3Utils.isAddress(web3Utils.toChecksumAddress(newVal));
        } catch (error) {
            $log.error(error);
        }

        let isValidHex = newVal && check;

        let existingToken = isValidHex ? getExistingTokenByAddress(newVal) : null;
        if (existingToken) {
            CommonService.showToast('warning', `${existingToken.symbol} token already exists. Please add a unique token and try again.`, null, 'Duplicate Token');
            return resetFormData();
        }

        if (isValidHex) {
            let existingToken = getTokenByContractAddress(newVal);

            if (existingToken) {
                data.symbol = existingToken.symbol;
                data.decimalPlaces = existingToken.decimal;
                data.tokenId = existingToken.id;
            } else {
                CommonService.showToast('success', 'Looking ERC20 Contract into blockchain');
                resetFormData();
                Web3Service.getContractInfo(newVal).then((responseArr) => {
                    if (!responseArr || responseArr.length != 2) {
                        return resetFormData();
                    }

                    let decimal = responseArr[0];
                    let symbol = responseArr[1];

                    if (incorectTokenSymbolsMap[symbol.toLowerCase()]) {
                        symbol = incorectTokenSymbolsMap[symbol.toLowerCase()];
                    }

                    data.symbol = symbol;
                    data.decimalPlaces = Number(decimal);
                    data.tokenId = '';

                    CommonService.showToast('success', 'Found Contract: ' + data.symbol);
                }).catch((err) => {
                    resetFormData();
                    CommonService.showToast('warning', 'Token address does not exist. Please double check and try again.');
                });
            }
        } else {
            resetFormData();
        }
    }, true);

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

    $scope.addCustomToken = (event, form) => {
        if (!$scope.formDataIsValid(form)) {
            return CommonService.showToast('warning', "Form isn't valid");
        }

        let newToken = $scope.formData;
        $scope.inProgress = true;

        Token.getBalanceByContractAddress(newToken.contractAddress, wallet.getPublicKeyHex()).then((balance) => {
            let balanceValueDivider = new BigNumber(10 ** newToken.decimalPlaces)
            balance = new BigNumber(balance).div(balanceValueDivider);
            let newWalletToken = {
                walletId: wallet.id,
                tokenId: newToken.tokenId,
                balance: balance
            }

            let successFn = (data) => {
                let formatedBalance = CommonService.numbersAfterComma(balance, 2);

                let newToken = wallet.addNewToken(data);

                let loadTokensPromise = SqlLiteService.loadTokens();

                $q.all([newToken.initialBalancePromise,loadTokensPromise]).then(() => {
                    $scope.inProgress = false;
                    $scope.cancel();
                    $rootScope.openNewERC20TokenInfoDialog(event, 'New ERC-20 Token Added:', newToken.symbol, formatedBalance);
                    CommonService.showToast('success', "Added");
                });
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

module.exports = AddCustomTokenDialogController;
