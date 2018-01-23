'use strict';

const EthUnits = requireAppModule('angular/classes/eth-units');

let $rootScope, $q, Web3Service, CommonService, ElectronService;

let readyToShowNotification = false;

class Wallet {

    static set Web3Service(value) { Web3Service = value; }
    static set CommonService(value) { CommonService = value; }
    static set $q(value) { $q = value; }
    static set $rootScope(value) { $rootScope = value; }
    static set ElectronService(value) { ElectronService = value; }

    constructor(privateKey, publicKey) {
        this.privateKey = privateKey;
        this.privateKeyHex = privateKey ? privateKey.toString('hex') : null;

        this.publicKey = publicKey;
        this.publicKeyHex = publicKey ? publicKey.toString('hex') : null;

        this.balanceWei = 0;
        this.balanceEth = 0;

        this.balanceInUsd = null;
        this.usdPerUnit = null;
    }

    getPrivateKey() {
        return this.privateKey;
    }

    getPrivateKeyHex() {
        return this.privateKeyHex;
    }

    getPublicKey() {
        return this.publicKey;
    }

    getPublicKeyHex() {
        return this.publicKeyHex;
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
                    ElectronService.showNotification('ETH Balance Changed', 'New Balance: ' + this.balanceEth);
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

module.exports = Wallet;