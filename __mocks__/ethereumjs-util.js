module.exports = {
	hashPersonalMessage(msgBuffer) {
		return msgBuffer;
	},
	ecsign(msgHash, privateKey, chainId = 1) {
		return { v: chainId, r: msgHash, s: Buffer.from(privateKey) };
	},
	toRpcSig(v, r, s, chainId = 1) {
		return v + r.toString('hex') + s.toString('hex') + chainId;
	},
	privateToPublic(b) {
		return b;
	},
	isValidPrivate() {
		return true;
	},
	addHexPrefix(str) {
		if (typeof str !== 'string') {
			throw new Error('should be string');
		}
		if (str.indexOf('0x') === 0) {
			return str;
		}
		return `0x${str}`;
	}
};
