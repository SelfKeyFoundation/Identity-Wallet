import ethUtil from 'ethereumjs-util';
import { getPrivateKey } from '../keystorage';
import { IdAttribute } from '../identity/id-attribute';

class Identity {
	constructor(wallet) {
		this.address = '0x' + wallet.publicKey;
		this.publicKey = null;
		this.profile = wallet.profile;
		this.privateKey = wallet.privateKey;
		this.keystorePath = wallet.keystoreFilePath;
		this.wid = wallet.id;

		if (this.privateKey) {
			this.publicKey = ethUtil
				.privateToPublic(Buffer.from(this.privateKey, 'hex'))
				.toString('hex');
		}
	}
	// async for future hardware wallet support
	async isUnlocked() {
		return !!this.publicKey && !!this.privateKey;
	}

	async genSignatureForMessage(msg) {
		let msgHash = ethUtil.hashPersonalMessage(Buffer.from(msg));
		let signature = ethUtil.ecsign(msgHash, Buffer.from(this.privateKey, 'hex'));
		return ethUtil.toRpcSig(signature.v, signature.r, signature.s);
	}

	async unlock(config) {
		if (this.profile !== 'local') {
			throw new Error('NOT_SUPPORTED');
		}
		try {
			this.privateKey = getPrivateKey(this.keystorePath, config.password).toString('hex');
			this.publicKey = ethUtil
				.privateToPublic(Buffer.from(this.privateKey, 'hex'))
				.toString('hex');
		} catch (error) {
			console.log(error);
			throw new Error('INVALID_PASSWORD');
		}
	}

	getAttributesByTypes(types = []) {
		return IdAttribute.findByTypeUrls(this.wid, types.filter(t => typeof t === 'string')).eager(
			'[documents, attributeType]'
		);
	}
}

export default Identity;
