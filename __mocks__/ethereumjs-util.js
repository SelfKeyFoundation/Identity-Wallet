module.exports = {
	hashPersonalMessage(msgBuffer) {
		return msgBuffer;
	},
	ecsign(msgHash, privateKey, chainId) {
		return { v: chainId, r: msgHash, s: Buffer.from(privateKey) };
	},
	toRpcSig(v, r, s, chainId) {
		return v + r.toString() + s.toString() + chainId;
	}
};
