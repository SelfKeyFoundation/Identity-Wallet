'use strict';

function SKTxHistoryDirective($rootScope, RPCService, CommonService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            tokenSymbol: '@'
        },
        link: (scope, element) => {

            let publicKey = '0x' + $rootScope.wallet.getPublicKey();
            scope.txList = [];
            scope.tokenSymbol = scope.tokenSymbol ? scope.tokenSymbol.toUpperCase() : null;

            let getTxStatusText = (tx) => {
                let status = tx.txReceiptStatus;
                let isSend = tx.from == publicKey;

                if (status == 0) {
                    return isSend ? 'Faild To Send' : 'Faild To Receive';
                }
                if (status == 1) {
                    return isSend ? 'Sent' : 'Received';
                }
                return '';
                //TODO in progress implementation
                // TODO unknown and in progress
            };
            let processTxHistoryList = (list) => {
                return list.map((tx) => {
                    let symbol = tx.tokenSymbol;
                    tx.symbol = symbol ? symbol.toUpperCase() : 'ETH';
                    tx.directionSign = publicKey == tx.from ? '- ' : '+ ';

                    tx.externalLink = `https://etherscan.io/tx/${tx.hash}`;

                    tx.statusText = getTxStatusText(tx);
                    //TODO finish implementation! in progress failed
                    tx.directionIcon = publicKey == tx.from ? 'paper-plane' : 'coins';

                    return tx;
                });
            };

            let fn, fnArgs = { publicKey };
            if (scope.tokenSymbol) {
                if (scope.tokenSymbol == 'ETH') {
                    fn = 'getByPublicKeyAndContractAddress';
                    fnArgs.contractAddress = null;
                } else {
                    fn = 'getTxHistoryByPublicKeyAndTokenSymbol';
                    fnArgs.tokenSymbol = scope.tokenSymbol;
                }
            }

            fn = fn || 'getTxHistoryByPublicKey';
            let transactions = RPCService.makeCall(fn, fnArgs).then((txList) => {
                scope.txList = processTxHistoryList(txList);
            }).catch((err) => {
                CommonService.showToast('error', 'Error while loading transactions history.');
            });
        },
        replace: true,
        templateUrl: 'common/directives/sk-tx-history.html'
    }
}

module.exports = SKTxHistoryDirective;
