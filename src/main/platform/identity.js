import ethUtil from 'ethereumjs-util';
import { getPrivateKey } from '../keystorage';
import { IdAttribute } from '../identity/id-attribute';
import { getGlobalContext } from 'common/context';
import { Logger } from 'common/logger';
import AppEth from '@ledgerhq/hw-app-eth';

const log = new Logger('Identity');
export class Identity {
	constructor(wallet) {
		this.address = wallet.publicKey;
		this.publicKey = null;
		this.profile = wallet.profile;
		this.privateKey = wallet.privateKey ? wallet.privateKey.replace('0x', '') : null;
		this.keystorePath = wallet.keystoreFilePath;
		this.wid = wallet.id;
		this.path = wallet.path;

		if (this.profile === 'local' && this.privateKey) {
			this.publicKey = ethUtil
				.privateToPublic(Buffer.from(this.privateKey, 'hex'))
				.toString('hex');
		} else {
			this.publicKey = this.getPublicKeyFromHardwareWallet();
		}
	}
	async getPublicKeyFromHardwareWallet() {
		if (this.profile === 'ledger') {
			const transport = await getGlobalContext().web3Service.getLedgerTransport();
			try {
				const appEth = new AppEth(transport);
				const address = await appEth.getAddress(this.path);
				return address.publicKey;
			} finally {
				transport.close();
			}
		} else if (this.profile === 'trezor') {
			const publicKey = await getGlobalContext().web3Service.trezorWalletSubProvider.getPublicKey(
				this.address
			);
			return publicKey;
		}
	}

	async genSignatureForMessage(msg) {
		const msgHash = ethUtil.hashPersonalMessage(Buffer.from(msg));
		let signature = {};
		switch (this.profile) {
			case 'ledger':
				const transport = await getGlobalContext().web3Service.getLedgerTransport();
				try {
					const appEth = new AppEth(transport);
					signature = await appEth.signPersonalMessage(this.path, msgHash);
				} finally {
					transport.close();
				}
				break;
			case 'trezor':
				const trezorSignature = await getGlobalContext().web3Service.trezorWalletSubProvider.signPersonalMessage(
					this.address,
					msgHash
				);
				return ethUtil.addHexPrefix(trezorSignature.message.signature);
			case 'local':
			default:
				signature = ethUtil.ecsign(msgHash, Buffer.from(this.privateKey, 'hex'));
		}
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
			log.error(error);
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
