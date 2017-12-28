import EthUnits from '../../classes/eth-units.js';
import EthUtils from '../../classes/eth-utils.js';
import Token from '../../classes/token.js';

function MemberLayoutController($rootScope, $scope, $log, $mdDialog, $mdSidenav, $interval, $timeout, $state, ConfigFileService, ElectronService, ConfigStorageService, CommonService, EtherScanService, EtherUnitsService, TokenService, WalletService, MEWService, Web3Service) {
    'ngInject'

    $log.info('MemberLayoutController');

    /**
     * 
     */
    TokenService.init();

    /**
     * selfkey token
     */
    $rootScope.primaryToken = TokenService.getBySymbol($rootScope.PRIMARY_TOKEN.toUpperCase());
    $rootScope.primaryToken.loadBalanceFor($rootScope.wallet.getPublicKeyHex());
    $rootScope.primaryToken.updatePriceInUsd($rootScope.keyUsdPrice);

    /**
     * Eth
     */
    $rootScope.wallet.updatePriceInUsd($rootScope.ethUsdPrice);

    $scope.openRightSidenav = () => {
        $mdSidenav('right').toggle().then(() => {
            $log.debug("toggle " + "right" + " is done");
        });
    }

    $rootScope.goToSelfkeyIco = (event) => {
        let ico = null;
        let icos = ConfigFileService.getIcos();
        for(let i in icos){
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

};

export default MemberLayoutController;