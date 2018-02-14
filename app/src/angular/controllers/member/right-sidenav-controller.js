function MemberRightSidenavController($rootScope, $scope, $log, $mdSidenav, $state, $mdDialog) {
    'ngInject'

    $log.info('RightSidenavController');

    $scope.close = () => {
        $mdSidenav('right').close().then(() => {
            $log.debug("close LEFT is done");
        });
    }

    $scope.getSelectedClass = (state) => {
        if ($state.current.name.indexOf(state) !== -1) {
            return "sk-right-sidenav__section__item__selected";
        }
    }

    $rootScope.navigate = ($event, state, params) => {
        $state.go(state, params);
        $scope.close();
    }

    $scope.getInfoDialog = function (event, text, title) {
        $rootScope.openInfoDialog(event, text, title)
        $scope.close();
    };

    $scope.getVersion = function (event) {
        $rootScope.openInfoDialog(event, $rootScope.version + ' ' + 'Version', 'version')
        $scope.close();
    };


};

module.exports = MemberRightSidenavController;
