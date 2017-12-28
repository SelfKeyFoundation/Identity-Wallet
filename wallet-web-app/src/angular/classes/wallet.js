'use strict';

class Wallet {

    constructor(keystoreObject) {
        this.keystoreObject = keystoreObject;
        this.privateKey = null;
        this.privateKeyHex = null;
        
        this.balanceWei = 0;
        this.balanceEth = 0;

        this.balanceInUsd = null;
        this.usdPerUnit = null;
    }

    setPrivateKey (privateKey) {
        this.privateKey = privateKey;
        this.privateKeyHex = privateKey.toString('hex');
    }
    
    getPrivateKey () {
        return this.privateKey;
    }

    getPrivateKeyHex () {
        return this.privateKeyHex;
    }

    getPublicKeyHex () {
        return this.keystoreObject.address;
    }

    getAddress () {
        return this.keystoreObject.address;
    }

    /**
     * 
     */
    updatePriceInUsd(usdPerUnit){
        this.usdPerUnit = usdPerUnit;
        this.balanceInUsd = (Number(this.balanceEth) * Number(usdPerUnit));
    }
}

export default Wallet;