function MemberDashboardMainController($rootScope, $scope, $log, $q, $timeout, $mdSidenav, ConfigFileService, CommonService, ElectronService, EtherScanService) {
    'ngInject'

    $log.info('MemberDashboardMainController');

    $scope.tmpData = {
        total: '1547.445',
        totalTitle: 'Tolal value USD',
        items: [{
            title: 'Ethereum',
            subTitle: 'eth',
            value: 852.56487,
            color: '#4080ff',
            icon: 'eth'
        }, {
            title: 'Geolem',
            subTitle: 'gnt',
            value: 852.56487,
            color: '#39d9e4'
        }, {
            title: 'Augur',
            subTitle: 'rep',
            value: 852.56487,
            color: '#9a4786',
            icon: 'unk'
        },{
            title: 'Augur1 a litle long',
            subTitle: 'rep2',
            value: 852.56487,
            color: 'red',
            icon: 'unk'
        }]
    }

};

export default MemberDashboardMainController;