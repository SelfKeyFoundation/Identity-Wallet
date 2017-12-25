function MemberSetupCompletedController($rootScope, $scope, $log, $q, $timeout, $state, ConfigFileService, WalletService, CommonService) {
    'ngInject'

    $log.info('MemberSetupCompletedController');

    let store = ConfigFileService.getStore();
    
    $scope.goToSelfkeyIco = (event) => {
        console.log("clicked")
        let ico = null;
        let icos = ConfigFileService.getIcos();

        for(let i in icos){
            console.log(i, icos[i]);
            for(let j in icos[i]){
                if(['key', 'KEY'].indexOf(icos[i][j].symbol) !== -1){
                    ico = icos[i][j];
                    break;
                }
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