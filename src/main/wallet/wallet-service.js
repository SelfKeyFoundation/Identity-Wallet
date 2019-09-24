import { Logger } from 'common/logger';
import { Wallet } from './wallet';
import fs from 'fs';
import path from 'path';
import { formatDataUrl, bufferFromDataUrl } from 'common/utils/document';
import EthUnits from 'common/utils/eth-units';
import * as EthUtil from 'ethereumjs-util';

const log = new Logger('wallet-model');
export class WalletService {
	constructor({ web3Service, config }) {
		this.web3Service = web3Service;
		this.config = config;
	}

	getWalletKeystorePath(address, walletsPath = null) {
		walletsPath = walletsPath || this.config.walletsDirectoryPath;
		return path.resolve(walletsPath, address);
	}

	async saveAccountToKeystore(account, password, walletsPath = null) {
		const keystore = this.web3Service.encryptAccount(account, password);
		const keystoreFileFullPath = this.getWalletKeystorePath(account.address, walletsPath);
		try {
			await fs.promises.writeFile(keystoreFileFullPath, JSON.stringify(keystore), 'utf8');
			return keystoreFileFullPath;
		} catch (error) {
			log.error(error);
			throw error;
		}
	}

	async loadAccountFromKeystore(filePath, password, address, walletsPath = null) {
		try {
			await fs.promises.access(filePath, fs.constants.R_OK);
		} catch (error) {
			if (!filePath && !address) {
				throw error;
			}
			filePath = this.getWalletKeystorePath(filePath || address, walletsPath);
		}
		let keystore = await fs.promises.readFile(filePath);
		return this.web3Service.decryptAccount(keystore, password);
	}

	async copyKeystoreFile(id, toPath) {
		const wallet = await Wallet.findById(id);
		try {
			await fs.promises.copyFile(
				wallet.keystoreFilePath,
				path.resolve(toPath, wallet.publicKey)
			);
			return true;
		} catch (error) {
			log.error(error);
			return false;
		}
	}

	async createWalletWithPassword(password) {
		const account = this.web3Service.createAccount(password);
		this.web3Service.setDefaultAccount(account);
		const keystoreFileFullPath = await this.saveAccountToKeystore(account, password);
		const wallet = await Wallet.create({
			publicKey: account.address,
			keystoreFilePath: keystoreFileFullPath,
			profile: 'local'
		});

		const newWallet = {
			...wallet,
			profilePicture: formatDataUrl(wallet.profilePicture),
			privateKey: account.privateKey
		};

		return newWallet;
	}

	async getBalance(id) {
		const wallet = await Wallet.findById(id);
		const balanceInWei = await this.web3Service.web3.eth.getBalance(wallet.publicKey);
		return EthUnits.toEther(balanceInWei, 'wei');
	}

	async getWallets() {
		const wallets = await Wallet.findAllWithKeyStoreFile();
		return wallets.map(w => ({ ...w, profilePicture: formatDataUrl(w.profilePicture) }));
	}

	async unlockWalletWithPassword(id, password) {
		const wallet = await Wallet.findById(id);
		const account = await this.loadAccountFromKeystore(
			wallet.keystoreFilePath,
			password,
			wallet.publicKey
		);
		if (!account) {
			throw new Error('Wrong Password!');
		}
		await this.web3Service.setDefaultAccount(account);
		return {
			...wallet,
			profilePicture: formatDataUrl(wallet.profilePicture),
			publicKey: account.address,
			privateKey: account.privateKey
		};
	}

	async unlockWalletWithNewFile(filePath, password) {
		const account = await this.loadAccountFromKeystore(filePath, password);

		if (!account) {
			throw new Error('Wrong Password!');
		}
		await this.web3Service.setDefaultAccount(account);
		const keystoreFileFullPath = await this.saveAccountToKeystore(account, password);

		let wallet = await Wallet.findByPublicKey(account.address);

		if (!wallet) {
			wallet = await Wallet.create({
				publicKey: account.address,
				keystoreFilePath: keystoreFileFullPath,
				profile: 'local'
			});
		}

		const newWallet = {
			...wallet,
			profilePicture: formatDataUrl(wallet.profilePicture),
			privateKey: account.privateKey
		};

		return newWallet;
	}

	async unlockWalletWithPrivateKey(privateKey) {
		if (!EthUtil.isValidPrivate(Buffer.from(privateKey.replace('0x', ''), 'hex'))) {
			throw new Error('The private key you entered is incorrect. Please try again!');
		}
		const account = this.web3Service.privateKeyToAccount(privateKey);

		this.web3Service.setDefaultAccount(account);

		let wallet = await Wallet.findByPublicKey(account.address);

		if (!wallet) {
			wallet = await Wallet.create({
				publicKey: account.address,
				profile: 'local'
			});
		}
		const newWallet = {
			...wallet,
			profilePicture: formatDataUrl(wallet.profilePicture),
			privateKey: account.privateKey
		};

		return newWallet;
	}

	async unlockWalletWithPublicKey(publicKey, hwPath, profile) {
		let wallet = await Wallet.findByPublicKey(publicKey);
		this.web3Service.setDefaultAddress(publicKey);

		if (!wallet) {
			wallet = await Wallet.create({
				publicKey,
				profile,
				path: hwPath
			});
		}

		return wallet;
	}

	async _getWallets(page, accountsQuantity) {
		return new Promise((resolve, reject) => {
			this.web3Service.web3.eth.getAccounts((error, accounts) => {
				if (error) {
					log.info('error: %j', error);
					reject(error);
				} else {
					const promises = accounts.map(async (address, index) => {
						const balanceInWei = await this.web3Service.web3.eth.getBalance(address);
						return {
							address,
							balance: EthUnits.toEther(balanceInWei, 'wei'),
							path: `44'/60'/0'/${page * accountsQuantity + index}`
						};
					});
					resolve(Promise.all(promises));
				}
			});
		});
	}

	updateWalletAvatar(avatar, id) {
		return Wallet.updateProfilePicture({
			id,
			profilePicture: bufferFromDataUrl(avatar)
		});
	}

	updateWalletName(name, id) {
		return Wallet.updateName({
			id,
			name: name
		});
	}

	updateWalletSetup(setup, id) {
		return Wallet.updateSetup({
			id,
			setup: setup
		});
	}

	async updateDID(id, did) {
		did = did.replace('did:selfkey:', '');
		return Wallet.updateDID({
			id,
			did
		});
	}

	async getLedgerWallets(page, accountsQuantity) {
		await this.web3Service.switchToLedgerWallet(page, accountsQuantity);
		return this._getWallets(page, accountsQuantity);
	}

	async getTrezorWallets(page, accountsQuantity, eventEmitter) {
		await this.web3Service.switchToTrezorWallet(page, accountsQuantity, eventEmitter);
		return this._getWallets(page, accountsQuantity);
	}

	sendTransaction(transactionObject) {
		return this.web3Service.web3.eth.sendTransaction(transactionObject);
	}
}

export default WalletService;

// async function testPaymentContract(wallet) {
// 	const ctx = getGlobalContext();
// 	console.log('XXX', wallet);
// 	let res = await ctx.selfkeyService.getAllowance(
// 		wallet.publicKey,
// 		'0xb91FF8627f30494d27b91Aac1cB3c7465BE58fF5'
// 	);
// 	const amount = 20000000000000;
// 	let gas = await ctx.selfkeyService.estimateApproveGasLimit(
// 		wallet.publicKey,
// 		'0xb91FF8627f30494d27b91Aac1cB3c7465BE58fF5',
// 		amount
// 	);

// 	console.log('XXX pre allow', res.toString());
// 	res = await ctx.selfkeyService.approve(
// 		wallet.publicKey,
// 		'0xb91FF8627f30494d27b91Aac1cB3c7465BE58fF5',
// 		amount,
// 		gas
// 	);
// 	console.log('XXX approve res', res.events.Approval.returnValues);
// 	res = await ctx.selfkeyService.getAllowance(
// 		wallet.publicKey,
// 		'0xb91FF8627f30494d27b91Aac1cB3c7465BE58fF5'
// 	);
// 	console.log('XXX post approve', res.toString());
// 	const did = wallet.did;
// 	// gas = await ctx.paymentService.getGasLimit(
// 	// 	wallet.publicKey,
// 	// 	did,
// 	// 	did,
// 	// 	10000,
// 	// 	ctx.web3Service.ensureStrHex('test'),
// 	// 	0,
// 	// 	0
// 	// );
// 	// console.log('XXX payment gas', gas);

// 	res = await ctx.paymentService.makePayment(
// 		wallet.publicKey,
// 		did,
// 		did,
// 		10000,
// 		ctx.web3Service.ensureStrHex('test'),
// 		0,
// 		0,
// 		4500000
// 	);
// 	console.log('XXX payment res', res);

// 	res = await ctx.selfkeyService.getAllowance(
// 		wallet.publicKey,
// 		'0xb91FF8627f30494d27b91Aac1cB3c7465BE58fF5'
// 	);
// 	console.log('XXX post payment', res.toString());
// }
