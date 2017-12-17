'use strict';

import BigNumber from 'bignumber.js';
import EthUtils from './eth-utils.js';
import CommonUtils from './common-utils.js';

class Token {

    /**
     * 
     */
    static get balanceHex() { return "0x70a08231"; }
    static get transferHex() { return "0xa9059cbb"; }

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
        this.balance = null;
        this.balanceDecimal = null;
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
    generateContractData(toAddress, value) {
        return Token.generateContractData(toAddress, value, this.decimal);
    }

    generateBalanceData(userAddress) {
        return Token.generateBalanceData(userAddress, this.contractAddress);
    }
}

export default Token;