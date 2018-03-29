'use strict';

function IdWalletInfoController($rootScope, $scope, $log, $mdDialog) {
    'ngInject'

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.infoArray = [
        {
            logo: 'selfkey',
            textPart1: 'Inside the SelfKey Identity Wallet you can manage, own, and fully control various parts of your SelfKey ID. It is also a direct interface to the Ethereum blockchain, allowing you to manage all of your ETH and ERC-20 token assets inside the wallet.',
            textPart2: 'After building out your SelfKey ID, you can unlock products and services inside the SelfKey Marketplace by staking KEY tokens. Think of staking like a refundable deposit. Staking is required to prevent spam and to ensure all parties interact in a professional and respectable manner. To learn more about this, click\n',
            header: 'About The SelfKey Identity Wallet',
            button1: 'cancel',
            button2: 'continue',
            step: 1
        },
        {
            logo: 'information-button',
            textPart1: 'Your identity profile is broken down into two parts: attributes and documents. Attributes are details about your identity such as birthday, phone, address, and city. Documents are proof of your identity such as a passport or utility bill. ',
            textPart2: 'We’ll be adding more features in the future, such as blockchain verified claims in your identity profile. All attributes and documents regarding your identity profile are stored locally on your computer, and SelfKey does not have any access to your information.',
            header: 'What Are ID Attributes & Documents?',
            button1: 'back',
            button2: 'Ok, take me to my Identity Wallet',
            step: 2
        },
    ];

    $scope.dialogInfo = $scope.infoArray[0];

    var count = 1;

    $scope.nextStep = function () {
        count++;
        $scope.dialogInfo = $scope.infoArray.find(function (item) {
            if (count == 3) {
                $scope.cancel();
            } else if (item.step == count && count != 3) {
                return item;
            }
        });

    }

    $scope.backStep = function () {
        count--;
        $scope.dialogInfo = $scope.infoArray.find(function (item) {
            if (count == 0) {
                $scope.cancel();
            } else if (item.step == count && count != 0) {
                return item;
            }
        });
    }


};

module.exports = IdWalletInfoController;
