'use strict';

const EthUnits = requireAppModule('angular/classes/eth-units');
const EthUtils = requireAppModule('angular/classes/eth-utils');
const Token = requireAppModule('angular/classes/token');

let $rootScope, $q, Web3Service, CommonService, ElectronService, SqlLiteService;

let readyToShowNotification = false;

class Wallet {

    static set $rootScope(value) { $rootScope = value; }
    static set $q(value) { $q = value; }
    static set Web3Service(value) { Web3Service = value; }
    static set CommonService(value) { CommonService = value; }
    static set ElectronService(value) { ElectronService = value; } // TODO remove (use RPCService instead)
    static set SqlLiteService(value) { SqlLiteService = value; }

    constructor(id, privateKey, publicKey) {
        this.id = id;
        this.privateKey = privateKey;
        this.privateKeyHex = privateKey ? privateKey.toString('hex') : null;

        this.publicKey = publicKey;
        this.publicKeyHex = publicKey ? publicKey.toString('hex') : null;

        this.balanceWei = 0;
        this.balanceEth = 0;

        this.balanceInUsd = null;
        this.usdPerUnit = null;

        this.tokens = {};
        this.idAttributes = {}
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

    updatePriceInUsd(usdPerUnit) {
        this.usdPerUnit = usdPerUnit;
        this.balanceInUsd = (Number(this.balanceEth) * Number(usdPerUnit));
    }

    /**
     * tokens
     */
    loadTokens() {
        let defer = $q.defer();
        SqlLiteService.loadWalletTokens(this.id).then((walletTokens) => {
            for (let i in walletTokens) {
                let token = walletTokens[i];
                this.tokens[token.symbol] = new Token(token.contractAddress, token.symbol, token.decimal, this);
            }
            defer.resolve(this.tokens);
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }

    /**
     * ID Attributes
     */
    loadIdAttributes() {
        let defer = $q.defer();

        SqlLiteService.loadIdAttributes(this.id).then((idAttributes) => {
            for (let i in idAttributes) {
                this.idAttributes[idAttributes[i].idAttributeType] = idAttributes[i];
            }

            defer.resolve(this.idAttributes);
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }

    getIdAttributes() {
        return this.idAttributes;
    }

    // temporary method - while we support only *ONE* item/value per attribute
    getIdAttributeItemValue(idAttributeTypeKey) {
        return this.idAttributes[idAttributeTypeKey] && this.idAttributes[idAttributeTypeKey].items && this.idAttributes[idAttributeTypeKey].items.length && this.idAttributes[idAttributeTypeKey].items[0].values && this.idAttributes[idAttributeTypeKey].items[0].values.length && (this.idAttributes[idAttributeTypeKey].items[0].values[0].staticData || this.idAttributes[idAttributeTypeKey].items[0].values[0].documentId) ? this.idAttributes[idAttributeTypeKey].items[0].values[0].staticData || this.idAttributes[idAttributeTypeKey].items[0].values[0].documentId : null;
    }

    /**
     *
     * @param {hex} toAddressHex
     * @param {eth} valueWei
     * @param {wei} gasPriceWei
     * @param {wei} gasLimitWei
     * @param {hex} contractDataHex Contract data
     */
    generateRawTransaction(toAddressHex, valueWei, gasPriceWei, gasLimitWei, contractDataHex, chainID) {
        let defer = $q.defer();

        let promise = Web3Service.getTransactionCount(this.getPublicKeyHex());
        promise.then((nonce) => {
            //wallet.nonceHex

            let rawTx = {
                nonce: EthUtils.sanitizeHex(EthUtils.decimalToHex(nonce)),
                gasPrice: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPriceWei)),
                gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimitWei)),
                to: EthUtils.sanitizeHex(toAddressHex),
                value: EthUtils.sanitizeHex(EthUtils.decimalToHex(valueWei)),
                chainId: chainID || 3 // if missing - use ropsten testnet
            }

            if (contractDataHex) {
                rawTx.data = EthUtils.sanitizeHex(contractDataHex);
            }

            let eTx = new Tx(rawTx);
            eTx.sign(this.privateKey);

            defer.resolve('0x' + eTx.serialize().toString('hex'));
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }

}

module.exports = Wallet;
