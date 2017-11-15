'use strict';

import BigNumber from 'bignumber.js';
import EthUtils from './eth-utils.js';
import CommonUtils from './common-utils.js';

const CONTRACTS_MAP = {};

class Token {
    static get CONTRACTS_MAP() { return CONTRACTS_MAP; }

    static get balanceHex() { return "0x70a08231"; }
    static get transferHex() { return "0xa9059cbb"; }

    constructor(contractAddress, userAddress, symbol, decimal, type) {
        this.contractAddress = contractAddress;
        this.userAddress = userAddress;
        this.symbol = symbol;
        this.decimal = decimal;
        this.type = type;
        this.balance = null;
        this.balanceDecimal = null;
        this.promise = null;
    }

    /**
     * statics methods
     */
    static addContractToMap(key, token) {
        Object.defineProperty(Token.CONTRACTS_MAP, key, {
            enumerable: true,
            value: token
        });
        return Token.CONTRACTS_MAP;
    }

    static generateContractData(toAdd, value, decimal) {
        try {
            if (!EthUtils.validateEtherAddress(toAdd)) return { error: 'invalid_address' };
            if (!CommonUtils.isNumeric(value) || parseFloat(value) < 0) return { error: 'invalid_value' };

            value = EthUtils.padLeft(new BigNumber(value).times(new BigNumber(10).pow(decimal)).toString(16), 64);
            toAdd = EthUtils.padLeft(EthUtils.getNakedAddress(toAdd), 64);

            return Token.transferHex + toAdd + value;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    // TODO rename generateBalanceData
    static getBalanceData(userAddress, contractAddress) {
        return EthUtils.getDataObj(contractAddress, Token.balanceHex, [EthUtils.getNakedAddress(userAddress)])
    }

    /**
     * 
     */
    generateContractData(toAddress, value) {
        return Token.generateContractData(toAddress, value, this.decimal);
    }

    generateBalanceData() {
        return Token.getBalanceData(this.userAddress, this.contractAddress);
    }
}

export default Token;