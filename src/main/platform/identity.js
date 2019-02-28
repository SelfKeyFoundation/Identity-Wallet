import ethUtil from 'ethereumjs-util';
import { getPrivateKey } from '../keystorage';
import { IdAttribute } from '../identity/id-attribute';
import { Logger } from 'common/logger';
import { getGlobalContext } from 'common/context';
import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import AppEth from '@ledgerhq/hw-app-eth';
const trezor = require('trezor.js');
const deviceList = new trezor.DeviceList();
let transport = null;

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
		this.web3Service = (getGlobalContext() || {}).web3Service;
	}

	async getLedgerAppEth() {
		if (!transport) transport = await HWTransportNodeHid.create();
		return new AppEth(transport);
	}

	async getPublicKeyFromHardwareWallet() {
		if (this.profile === 'ledger') {
			try {
				const appEth = await this.getLedgerAppEth();
				const address = await appEth.getAddress(this.path);
				return address.publicKey;
			} catch (error) {
				log.error(error);
			}
		} else if (this.profile === 'trezor') {
			try {
				const { session } = await deviceList.acquireFirstDevice(true);
				const publicKey = await session.getPublicKey(this.path, 'ethereum');
				console.log('TREZOR ', publicKey);
				return publicKey;
			} catch (error) {
				log.error(error);
			}
		}
	}

	async genSignatureForMessage(msg) {
		const msgHash = ethUtil.hashPersonalMessage(Buffer.from(msg));
		let signature = {};
		try {
			switch (this.profile) {
				case 'ledger':
					const appEth = await this.getLedgerAppEth();
					signature = await appEth.signPersonalMessage(this.path, msgHash);
					return ethUtil.toRpcSig(signature.v, signature.r, signature.s);
				case 'trezor':
					break;
				case 'local':
				default:
					signature = ethUtil.ecsign(msgHash, Buffer.from(this.privateKey, 'hex'));
					return ethUtil.toRpcSig(signature.v, signature.r, signature.s);
			}
		} catch (error) {
			log.error(error);
		}
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
