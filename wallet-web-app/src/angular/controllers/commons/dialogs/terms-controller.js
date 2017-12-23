function TermsDialogController($rootScope, $scope, $log, $q, $mdDialog) {
    'ngInject'

    $log.info('TermsDialogController');

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    };



    setTimeout(function () {
        $scope.scrolledBottom = true;
        var elem = angular.element(document.querySelector(".textual"));
        var elemChild = angular.element(document.querySelector(".text"));

        var wholeHeight = elemChild[0].scrollHeight;
        var visibleHeight = elem[0].offsetHeight;
        elem.on("scroll", function (ev) {
            if(elem[0].scrollTop >= (wholeHeight - visibleHeight -50)){
                $scope.scrolledBottom = false;
            }

        });
    }, 1000)
};

export default TermsDialogController;