'use strict';

class CommonUtils {
    constructor() {
    }

    static hexToAscii(hex) {
        return hex.match(/.{1,2}/g).map(function (v) {
            return String.fromCharCode(parseInt(v, 16));
        }).join('');
    }

    static isAlphaNumeric(value) {
        return !/[^a-zA-Z0-9]/.test(value);
    }

    static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
}

export default CommonUtils;