'use strict';

import BigNumber from 'bignumber.js';
import EthUtils from './eth-utils.js';
import CommonUtils from './common-utils.js';

let $rootScope, $q, Web3Service;

class Token {

    /**
     * 
     */
    static get balanceHex() { return "0x70a08231"; }
    static get transferHex() { return "0xa9059cbb"; }

    static set Web3Service(value) { Web3Service = value; }
    static set $q(value) { $q = value; }
    static set $rootScope(value) { $rootScope = value; }

    /**
     * 
     * @param {*} contractAddress 
     * @param {*} symbol 
     * @param {*} decimal 
     * @param {*} type 
     */
    constructor(contractAddress, symbol, decimal, type) {
        this.contractAddress = contractAddress;
        this.symbol = symbol;
        this.decimal = decimal;
        this.type = type;

        this.balanceHex = null;
        this.balanceDecimal = null;

        this.balanceInUsd = null;
        this.usdPerUnit = null;

        this.currentOwnerPublicKeyHex = null;

        this.promise = null;
    }

    static generateContractData(toAdd, value, decimal) {
        try {
            if (!EthUtils.validateEtherAddress(toAdd)) return { error: 'invalid_address' };
            if (!CommonUtils.isNumeric(value) || parseFloat(value) < 0) return { error: 'invalid_value' };
            value = EthUtils.padLeft(new BigNumber(value).times(new BigNumber(10).pow(decimal)).toString(16), 64);
            toAdd = EthUtils.padLeft(EthUtils.getNakedAddress(toAdd), 64);
            return {
                error: null,
                data: Token.transferHex + toAdd + value
            }
        } catch (e) {
            return {
                error: e,
                data: null
            };
        }
    }

    static generateBalanceData(userAddress, contractAddress) {
        return EthUtils.getDataObj(contractAddress, Token.balanceHex, [EthUtils.getNakedAddress(userAddress)])
    }

    /**
     * 
     */
    setOwner(publicKeyHex) {
        this.currentOwnerPublicKeyHex = publicKeyHex
    }

    /**
     * 
     */
    getBalanceDecimal() {
        return new BigNumber(this.balanceDecimal).div(new BigNumber(10).pow(this.decimal)).toString();
    }

    generateContractData(toAddress, value) {
        return Token.generateContractData(toAddress, value, this.decimal);
    }

    generateBalanceData(userAddress) {
        return Token.generateBalanceData(userAddress, this.contractAddress);
    }

    /**
     * 
     */
    loadBalanceFor(userAddress) {
        let defer = $q.defer();

        let data = this.generateBalanceData(userAddress);
        let promise = Web3Service.getTokenBalanceByData(data);

        promise.then((balanceHex) => {
            let oldBalanceHex = angular.copy(this.balanceHex);

            this.balanceHex = balanceHex;
            this.balanceDecimal = EthUtils.hexToDecimal(balanceHex);

            if (this.usdPerUnit) {
                this.updatePriceInUsd(this.usdPerUnit);
            }

            if(balanceHex !== oldBalanceHex){
                $rootScope.$broadcast('balance:change', this.symbol, this.getBalanceDecimal(), this.balanceInUsd);
                // TODO - scan transactions
            }

            defer.resolve(this);
        }).catch((error) => {
            defer.reject(error);
        });

        return defer.promise;
    }

    loadBalance() {
        return this.loadBalanceFor(this.currentOwnerPublicKeyHex);
    }

    /**
     * 
     */
    updatePriceInUsd(usdPerUnit) {
        this.usdPerUnit = usdPerUnit;
        this.balanceInUsd = (Number(this.getBalanceDecimal()) * Number(usdPerUnit));
    }
}

export default Token;