function MemberSetupCompletedController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService, CommonService) {
    'ngInject'

    $log.info('MemberSetupCompletedController');

    let store = ConfigFileService.getStore();
    
    $rootScope.goToSelfkeyIco = (event) => {
        let ico = null;
        let icos = ConfigFileService.getIcos();
        for(let i in icos){
            if(['key', 'KEY'].indexOf(icos[i].symbol) !== -1){
                ico = icos[i];
                break;
            }
        }
        if(ico){
            $state.go('member.marketplace.ico-item', {selected: ico})
        }
    }
    
    store.setup.icoAdsShown = true;
    ConfigFileService.save();

};

export default MemberSetupCompletedController;