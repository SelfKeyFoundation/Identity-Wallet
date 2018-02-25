const EthUnits = requireAppModule("angular/classes/eth-units");
const EthUtils = requireAppModule("angular/classes/eth-utils");
const Token = requireAppModule("angular/classes/token");

function MemberLayoutController(
	$rootScope,
	$scope,
	$log,
	$mdDialog,
	$mdSidenav,
	$interval,
	$timeout,
	$state,
	ConfigFileService,
	ElectronService,
	CommonService,
	EtherScanService,
	EtherUnitsService,
	TokenService,
	WalletService,
	MEWService,
	Web3Service
) {
	"ngInject";

	$scope.showScrollStyle = false;

	var OSName = "Unknown OS";
	if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
	if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
	if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

	if (OSName === "Windows") {
		$scope.showScrollStyle = true;
	}

	$log.info("MemberLayoutController");

	/**
	 *
	 */
	$scope.openRightSidenav = () => {
		$mdSidenav("right")
			.toggle()
			.then(() => {
				$log.debug("toggle " + "right" + " is done");
			});
	};
	/*
    let store = ConfigFileService.getStore();
    Object.keys(store.wallets).forEach(key =>{
        let storedWallet = store.wallets[key];
        let storedWalletData = storedWallet.data || {};
        delete storedWalletData.activities;
    }); */

    Web3Service.syncWalletActivityByContract();
    Web3Service.syncWalletActivityByETH();

    $rootScope.goToSelfkeyIco = (event) => {
        let ico = null;
        let icos = ConfigFileService.getIcos();
        for (let i in icos) {
            for (let j in icos[i]) {
                if (['key', 'KEY'].indexOf(icos[i][j].symbol) !== -1) {
                    ico = icos[i][j];
                    break;
                }
            }
        }
        if (ico) {
            $state.go('member.marketplace.ico-item', { selected: ico });
        }
    }

};

module.exports = MemberLayoutController;
