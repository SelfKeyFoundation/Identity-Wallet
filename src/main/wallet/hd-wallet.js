import { mnemonicToSeed, generateMnemonic } from 'bip39';
import * as ethUtil from 'ethereumjs-util';
import HDNode from 'hdkey';

export class HDWallet {
	constructor(root, seed) {
		this.root = root;
		this.seed = seed;
	}

	static generateMnemonic() {
		return generateMnemonic();
	}

	static async createFromMnemonic(mnemonic) {
		const seed = await mnemonicToSeed(mnemonic);
		const rootNode = HDNode.fromMasterSeed(seed);

		return new HDWallet(rootNode, seed.toString('hex'));
	}

	static createFromSeed(seed) {
		const rootNode = HDNode.fromMasterSeed(Buffer.from(seed, 'hex'));
		return new HDWallet(rootNode, seed);
	}

	static createFromJSON(obj) {
		const rootNode = HDNode.fromJSON(obj);

		return new HDWallet(rootNode);
	}

	getAccounts(offset = 0, limit = 10, pathTpl = undefined) {
		const accounts = [];
		for (let i = offset; i < offset + limit; i++) {
			const accountPath = this.constructor.getPathForAccountIdx(i, pathTpl);
			const wallet = this.createWallet(accountPath);

			accounts.push({
				address: wallet.address,
				path: wallet.path
			});
		}

		return accounts;
	}

	createWallet(path) {
		const addrNode = this.root.derive(path);
		const privateKeyBuffer = addrNode.privateKey;
		const addressBuffer = ethUtil.privateToAddress(privateKeyBuffer);
		const address = ethUtil.bufferToHex(addressBuffer);
		const privateKey = ethUtil.bufferToHex(privateKeyBuffer);
		return {
			address,
			privateKey,
			path
		};
	}

	static getPathForAccountIdx(idx = 0, pathTpl = `m/44'/60'/0'/0/x`) {
		return pathTpl.replace('x', idx);
	}

	toJSON() {
		return this.root.toJSON();
	}
}

export default HDWallet;
