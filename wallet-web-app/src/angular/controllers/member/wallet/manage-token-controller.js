function ManageTokenController($rootScope, $scope, $log, $mdDialog) {
    'ngInject'

    $scope.openReceiveDialog = function (event, actionType) {
        $mdDialog.show({
            controller: 'ReceiveTokenDialogController',
            templateUrl: 'common/dialogs/receive-token.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                config: {},
            }
        }).then((respItem) => {

        });
    };


};

export default ManageTokenController;