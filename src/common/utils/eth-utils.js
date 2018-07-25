import { BigNumber } from 'bignumber.js';
let web3;

class EthUtils {
	static set web3(value) {
		web3 = value;
	}

	static isChecksumAddress(address) {
		return address === this.toChecksumAddress(address);
	}

	static validateEtherAddress(address) {
		if (address.substring(0, 2) !== '0x') return false;
		else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
		else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address))
			return true;
		else return EthUtils.isChecksumAddress(address);
	}

	static toChecksumAddress(address) {
		try {
			if (EthUtils.isChecksumAddress(address)) {
				return address;
			}
			return this.getWeb3().utils.toChecksumAddress(address);
		} catch (e) {
			return null;
		}
	}

	static getWeb3() {
		return web3;
	}

	static signChallenge(challenge, privateKeyHex) {
		const hash = this.sha256(Buffer.from(challenge, 'hex'));
		let msgHash = this.hashPersonalMessage(Buffer.from(hash, 'hex'));
		let signature = this.ecsign(msgHash, Buffer.from(privateKeyHex, 'hex'));

		return {
			sig:
				'0x' +
				signature.r.toString('hex') +
				signature.s.toString('hex') +
				signature.v.toString(),
			msg: '0x' + msgHash.toString('hex'),
			challenge: challenge
		};

		/*
        const hash = ethUtil.sha256(Buffer.from(message, 'hex'));

        //signature = ethUtil.ecsign(msgHash, Buffer.from('56ac03d5164ddd66f50d83b63b6c66261ea94285e81d5e0e2ffdb9f6a439f46f', 'hex'));
        //signature = '0x' + signature.r.toString('hex') + signature.s.toString('hex') + signature.v.toString();

        let msg         = ethUtil.hashPersonalMessage(Buffer.from(hash, 'hex'));
        let signed      = ethUtil.ecsign(msg, privateKey);
        let combined    = Buffer.concat([Buffer.from(signed.r), Buffer.from(signed.s), Buffer.from([signed.v])]);
        let combinedHex = combined.toString('hex');

        return { hex: '0x' + combinedHex, buffer: combined };
        */
	}

	static validateHexString(str) {
		if (str === '') return true;
		str = str.substring(0, 2) === '0x' ? str.substring(2).toUpperCase() : str.toUpperCase();
		let re = /^[0-9A-F]+$/g;
		return re.test(str);
	}

	static padLeftEven(hex) {
		hex = hex.length % 2 !== 0 ? '0' + hex : hex;
		return hex;
	}

	static sanitizeHex(hex) {
		hex = '' + hex;
		hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
		if (hex === '') return '';
		return '0x' + EthUtils.padLeftEven(hex);
	}

	static trimHexZero(hex) {
		if (hex === '0x00' || hex === '0x0') return '0x0';
		hex = EthUtils.sanitizeHex(hex);
		hex = hex.substring(2).replace(/^0+/, '');
		return '0x' + hex;
	}

	static decimalToHex(dec) {
		return new BigNumber(dec).toString(16);
	}

	static bufferToHex(buffer) {
		return this.bufferToHex(this.privateToAddress(buffer));
	}

	static hexToDecimal(hex) {
		if (hex === '0x') return 0;
		return new BigNumber(EthUtils.sanitizeHex(hex)).toString();
	}

	static contractOutToArray(hex) {
		hex = hex.replace('0x', '').match(/.{64}/g);
		for (var i = 0; i < hex.length; i++) {
			hex[i] = hex[i].replace(/^0+/, '');
			hex[i] = hex[i] === '' ? '0' : hex[i];
		}
		return hex;
	}

	static getNakedAddress(address) {
		return address.toLowerCase().replace('0x', '');
	}

	static getDeteministicContractAddress(address, nonce) {
		nonce = new BigNumber(nonce).toString();
		address = address.substring(0, 2) === '0x' ? address : '0x' + address;
		return '0x' + this.generateAddress(address, nonce).toString('hex');
	}

	static padLeft(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

	static getDataObj(to, func, arrVals) {
		var val = '';
		for (var i = 0; i < arrVals.length; i++) val += EthUtils.padLeft(arrVals[i], 64);
		return {
			to: to,
			data: func + val
		};
	}

	static getFunctionSignature(name) {
		return this.sha3(name)
			.toString('hex')
			.slice(0, 8);
	}

	static getBalanceDecimal(balance, decimal) {
		return new BigNumber(balance).div(new BigNumber(10).pow(decimal)).toString();
	}
}

export default EthUtils;
