function AddCustomTokenDialogController($rootScope, $scope, $log, $q, $mdDialog) {
    'ngInject'

    $log.info('AddCustomTokenDialogController');
    $scope.showTooltip = false;
    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    const MAX_TIMESTAMP = 8640000000000000;
    let tooltipDisipareDate = new Date();
    const tooltipDisipareLastTime = new Date(new Date().getTime() + 1990);

    $scope.setShowTooltip = function (value) {
        if (value) {
            $scope.showTooltip = true;
            tooltipDisipareDate = new Date(MAX_TIMESTAMP);
            return;
        }

        tooltipDisipareDate = tooltipDisipareLastTime;
        setTimeout(function () {
            if (tooltipDisipareDate < new Date()) {
                $scope.showTooltip = false;
            }
        }, 2000);
    }
};

export default AddCustomTokenDialogController;