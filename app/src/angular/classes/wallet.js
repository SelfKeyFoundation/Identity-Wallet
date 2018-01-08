'use strict';

import EthUnits from './eth-units';

let $rootScope, $q, Web3Service, CommonService, ElectronService;

let readyToShowNotification = false;

class Wallet {

    static set Web3Service(value) { Web3Service = value; }
    static set CommonService(value) { CommonService = value; }
    static set $q(value) { $q = value; }
    static set $rootScope(value) { $rootScope = value; }
    static set ElectronService(value) { ElectronService = value; }

    constructor(keystoreObject) {
        this.keystoreObject = keystoreObject;

        this.privateKey = null;
        this.privateKeyHex = null;

        this.balanceWei = 0;
        this.balanceEth = 0;

        this.balanceInUsd = null;
        this.usdPerUnit = null;
    }

    setPrivateKey(privateKey) {
        this.privateKey = privateKey;
        this.privateKeyHex = privateKey.toString('hex');
    }

    getPrivateKey() {
        return this.privateKey;
    }

    getPrivateKeyHex() {
        return this.privateKeyHex;
    }

    getPublicKeyHex() {
        return this.keystoreObject.address;
    }

    getAddress() {
        return this.keystoreObject.address;
    }

    /**
     * 
     */
    loadBalance() {
        let defer = $q.defer();
        let promise = Web3Service.getBalance("0x" + this.getPublicKeyHex());

        promise.then((balanceWei) => {
            let oldBalanceInWei = angular.copy(this.balanceWei);

            this.balanceEth = EthUnits.toEther(balanceWei, 'wei');
            this.balanceEth = Number(CommonService.numbersAfterComma(this.balanceEth, 8));
            this.balanceWei = balanceWei;

            this.updatePriceInUsd(this.usdPerUnit);

            if (balanceWei !== oldBalanceInWei) {
                $rootScope.$broadcast('balance:change', 'eth', this.balanceEth, this.balanceInUsd);
                if (readyToShowNotification) {
                    console.log("SHOULD SHOW NOTIFICATION");
                    ElectronService.showNotification('ETH Balance Changed', 'New Balance: ' + this.balanceEth)
                }
            }

            readyToShowNotification = true;

            defer.resolve(this);
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }

    /**
     * 
     */
    updatePriceInUsd(usdPerUnit) {
        this.usdPerUnit = usdPerUnit;
        this.balanceInUsd = (Number(this.balanceEth) * Number(usdPerUnit));
    }
}

export default Wallet;