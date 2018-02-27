function IDWInfoDialogController($rootScope, $scope, $log, $mdDialog) {
    'ngInject'

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.infoArray = [
        {
            logo: 'selfkey',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            header: 'About The Selfkey IDentity Wallet',
            button1: 'cancel',
            button2: 'continue',
            step: 1
        },
        {
            logo: 'information-button',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            header: 'Your ID Attributes',
            button1: 'back',
            button2: 'continue',
            step: 2
        },
        {
            logo: 'plus',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
            header: 'Everything Is Stored Locally On Your Computer',
            button1: 'back',
            button2: 'Ok,take me to my ID wallet',
            step: 3
        },
    ]

    $scope.dialogInfo = $scope.infoArray[0];

    var count = 1;

    $scope.nextStep = function () {
        count++;
        $scope.dialogInfo = $scope.infoArray.find(function (item) {
            if (count == 4) {
                $scope.cancel();
            } else if (item.step == count && count != 4) {
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

module.exports = IDWInfoDialogController;
