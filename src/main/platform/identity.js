import ethUtil from 'ethereumjs-util';
import config from 'common/config';

class Identity {
	constructor(wallet) {
		this.publicKey = wallet.publicKey;
		this.profile = wallet.profile;
		this.privateKey = wallet.privateKey;
		this.chainId = config.chainId;
	}
	// async for future hardware wallet support
	async isUnlocked() {
		return !!this.publicKey && !!this.privateKey;
	}

	async genSignatureForMessage(msg) {
		let msgHash = ethUtil.hashPersonalMessage(Buffer.from(msg));
		let signature = ethUtil.ecsign(msgHash, this.privateKey, this.chainId);
		return ethUtil.toRpcSig(signature.v, signature.r, signature.s, this.chainId);
	}
}

export default Identity;
