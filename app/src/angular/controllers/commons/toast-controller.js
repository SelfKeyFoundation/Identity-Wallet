function ToastController($rootScope, $scope, $log, message, type) {
    'ngInject'

    $log.info('ToastController', message);

    $scope.type = type;
    $scope.message = message;
    $scope.typeClass = "md-toast-" + type;
    $scope.icon = type === 'error' ? 'info-icon' : 'info-icon';
};

module.exports = ToastController;
