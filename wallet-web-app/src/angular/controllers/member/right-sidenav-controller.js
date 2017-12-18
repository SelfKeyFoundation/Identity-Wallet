function MemberRightSidenavController($rootScope, $scope, $log, $mdSidenav, $state) {
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

};

export default MemberRightSidenavController;