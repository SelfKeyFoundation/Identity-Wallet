'use strict';

class Wallet {

    constructor(keystoreObject) {
        this.keystoreObject = keystoreObject;
        this.privateKey = null;
        this.balanceWei = 0;
        this.balanceEth = 0;
    }

    setPrivateKey (privateKey) {
        this.privateKey = privateKey;
    }
    
    getPrivateKey () {
        return this.privateKey;
    }

    getAddress () {
        return this.keystoreObject.address;
    }
}

export default Wallet;