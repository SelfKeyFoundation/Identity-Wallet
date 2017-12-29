'use strict';

import EthUnits from './eth-units';

let $q, Web3Service, CommonService;

class Wallet {

    static set Web3Service(value) { Web3Service = value; }
    static set CommonService(value) { CommonService = value; }
    static set $q(value) { $q = value; }

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
            this.balanceEth = EthUnits.toEther(balanceWei, 'wei');
            this.balanceEth = Number(CommonService.numbersAfterComma(this.balanceEth, 8));
            this.balanceWei = balanceWei;
            
            this.updatePriceInUsd(this.usdPerUnit);

            defer.resolve(this);
        }).catch((error) => {
            console.log(error)
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