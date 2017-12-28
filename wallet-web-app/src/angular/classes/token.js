'use strict';

import BigNumber from 'bignumber.js';
import EthUtils from './eth-utils.js';
import CommonUtils from './common-utils.js';

let Web3Service;
let $q;

class Token {

    /**
     * 
     */
    static get balanceHex() { return "0x70a08231"; }
    static get transferHex() { return "0xa9059cbb"; }

    static set Web3Service(value) { Web3Service = value; }
    static set $q(value) { $q = value; }

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
        console.log(">>>> loadBalanceFor >>", userAddress)
        let defer = $q.defer();

        let data = this.generateBalanceData(userAddress);
        console.log("token balance contract data:", data)
        
        
        let promise = Web3Service.getTokenBalanceByData(data);
 
        promise.then((balanceHex) => {
            this.balanceHex = balanceHex;
            this.balanceDecimal = EthUtils.hexToDecimal(balanceHex);
            console.log(this);
            defer.resolve(this);
        }).catch((error) => {
            console.log(error);
            defer.reject(error);
        });

        return defer.promise;
    }

    /**
     * 
     */
    updatePriceInUsd(usdPerUnit){
        this.usdPerUnit = usdPerUnit;
        this.balanceInUsd = (Number(this.balanceDecimal) * Number(usdPerUnit));
    }
}

export default Token;