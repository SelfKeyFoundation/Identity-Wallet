import * as ethUtil from 'ethereumjs-util';
import { getPrivateKey } from '../keystorage';
import { IdAttribute } from '../identity/id-attribute';
import { getGlobalContext } from 'common/context';
import { Logger } from 'common/logger';
import { isDevMode } from 'common/utils/common';
import AppEth from '@ledgerhq/hw-app-eth';

const log = new Logger('Identity');
export class Identity {
	constructor(wallet, ident) {
		this.address = wallet.address;
		this.publicKey = null;
		this.profile = wallet.profile;
		this.privateKey = wallet.privateKey ? wallet.privateKey.replace('0x', '') : null;
		this.keystorePath = wallet.keystoreFilePath;
		this.did = ident.did
			? `did:selfkey:${ident.did.replace('did:selfkey:', '')}`
			: `did:eth:${this.address ? this.address.toLowerCase() : ''}`;
		this.wid = wallet.id;
		this.path = wallet.path;
		this.wallet = wallet;
		this.ident = ident;
		if (this.profile === 'local' && this.privateKey) {
			this.publicKey = ethUtil
				.privateToPublic(Buffer.from(this.privateKey, 'hex'))
				.toString('hex');
		} else {
			this.publicKey = this.getPublicKeyFromHardwareWallet();
		}
		if (typeof this.publicKey === 'string') {
			this.publicKey = ethUtil.addHexPrefix(this.publicKey);
		}
		if (this.publicKey && this.publicKey.then) {
			this.publicKey.then(publicKey => {
				if (typeof publicKey !== 'string') {
					return publicKey;
				}
				this.publicKey = ethUtil.addHexPrefix(publicKey);
				return this.publicKey;
			});
		}
	}
	getKeyId() {
		return `${this.getDidWithParams()}#keys-1`;
	}
	getDidWithParams() {
		if (!this.ident.did || !isDevMode()) {
			return this.did;
		}
		return `${this.did};selfkey:chain=ropsten`;
	}
	async getPublicKeyFromHardwareWallet() {
		if (this.profile === 'ledger') {
			const transport = await getGlobalContext().web3Service.getLedgerTransport();
			try {
				const appEth = new AppEth(transport);
				const address = await appEth.getAddress(this.path);
				return ethUtil.addHexPrefix(address.publicKey);
			} finally {
				transport.close();
			}
		} else if (this.profile === 'trezor') {
			const publicKey = await getGlobalContext().web3Service.trezorWalletSubProvider.getPublicKey(
				this.address
			);
			return ethUtil.addHexPrefix(publicKey);
		}
	}

	async genSignatureForMessage(msg) {
		let signature = {};
		switch (this.profile) {
			case 'ledger':
				const transport = await getGlobalContext().web3Service.getLedgerTransport();
				try {
					const appEth = new AppEth(transport);
					const msgBufferHex = Buffer.from(msg).toString('hex');
					const result = await appEth.signPersonalMessage(this.path, msgBufferHex);
					const v = parseInt(result.v, 10) - 27;
					let vHex = v.toString(16);
					if (vHex.length < 2) {
						vHex = `0${v}`;
					}
					return `0x${result.r}${result.s}${vHex}`;
				} finally {
					transport.close();
				}
			case 'trezor':
				const msgBufferHex = Buffer.from(msg).toString('hex');
				const trezorSignature = await getGlobalContext().web3Service.trezorWalletSubProvider.signPersonalMessage(
					this.address,
					msgBufferHex
				);
				return ethUtil.addHexPrefix(trezorSignature.message.signature);
			case 'local':
			default:
				const msgHash = ethUtil.hashPersonalMessage(Buffer.from(msg));
				signature = ethUtil.ecsign(msgHash, Buffer.from(this.privateKey, 'hex'));
		}
		return ethUtil.toRpcSig(signature.v, signature.r, signature.s);
	}

	async unlock(config) {
		if (this.profile !== 'local') {
			this.publicKey = this.getPublicKeyFromHardwareWallet();
		} else {
			try {
				this.privateKey = getPrivateKey(this.keystorePath, config.password).toString('hex');
				this.publicKey = ethUtil.addHexPrefix(
					ethUtil.privateToPublic(Buffer.from(this.privateKey, 'hex')).toString('hex')
				);
			} catch (error) {
				log.error(error);
				throw new Error('INVALID_PASSWORD');
			}
		}
	}

	getAttributesByTypes(types = []) {
		return IdAttribute.findByTypeUrls(
			this.ident.id,
			types.filter(t => typeof t === 'string')
		).eager('[documents, attributeType]');
	}
}

export default Identity;
