'use strict';

function IdWalletInfoController($rootScope, $scope, $log, $mdDialog) {
    'ngInject'

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.infoArray = [
        {
            logo: 'selfkey',
            text: 'In the SelfKey Identity Wallet you can manage, own, and control various parts of your digital identity. Whether it’s a copy of your passport, utility bill, or other document—everything is stored locally on your machine and not in a server. After building out your identity, you can participate in the SelfKey Marketplace for products and services such as joining an ICO by submitting KYC documents from the wallet.',
            header: 'About The SelfKey Identity Wallet',
            button1: 'cancel',
            button2: 'continue',
            step: 1
        },
        {
            logo: 'information-button',
            text: 'Your identity profile is broken down into two parts: attributes and documents. Attributes are details about your identity such as birthday, phone, address, and city. Documents are proof of your identity such as a passport or utility bill. We’ll be adding more features in the future, such as blockchain verified claims in your identity profile. All attributes and documents regarding your identity profile are stored locally on your computer, and SelfKey does not have any access to your information.',
            header: 'What Are ID Attributes & Documents',
            button1: 'back',
            button2: 'continue',
            step: 2
        },
        {
            logo: 'menu-button',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            header: 'Your ID Documents',
            button1: 'back',
            button2: 'continue',
            step: 3
        },
        {
            logo: 'plus',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            header: 'Everything Is Stored Locally On Your Computer',
            button1: 'back',
            button2: 'Ok,take me to my ID wallet',
            step: 4
        },
    ]

    $scope.dialogInfo = $scope.infoArray[0];

    var count = 1;

    $scope.nextStep = function () {
        count++;
        $scope.dialogInfo = $scope.infoArray.find(function (item) {
            if (count == 5) {
                $scope.cancel();
            } else if (item.step == count && count != 5) {
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
