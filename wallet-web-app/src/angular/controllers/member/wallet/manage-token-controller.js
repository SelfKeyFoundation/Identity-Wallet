function ManageTokenController($rootScope, $scope, $log, $q, $timeout, $mdSidenav, ConfigFileService, CommonService, ElectronService, EtherScanService,$mdDialog) {
    'ngInject'

    console.log(5555)

    $scope.openReceiveDialog = function (event, actionType) {
        console.log(333,actionType)
        $mdDialog.show({
            controller: 'ReceiveTokenDialogController',
            templateUrl: 'common/dialogs/receive-token.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                config: {

                },
            }
        }).then((respItem) => {

        });
    };


};

export default ManageTokenController;