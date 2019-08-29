import { Logger } from 'common/logger';
import { Wallet } from './wallet';
import fs from 'fs';
import path from 'path';
import EthUnits from 'common/utils/eth-units';
import * as EthUtil from 'ethereumjs-util';

const log = new Logger('wallet-model');
export class WalletService {
	constructor({ web3Service, config }) {
		this.web3Service = web3Service;
		this.config = config;
	}

	async createWallet(password) {
		const account = this.web3Service.web3.eth.accounts.create(password);
		this.web3Service.web3.eth.accounts.wallet.add(account);
		this.web3Service.web3.eth.defaultAccount = account.address;
		const { address, privateKey } = account;
		const keystore = this.web3Service.web3.eth.accounts.encrypt(privateKey, password);
		const keystoreFileFullPath = path.resolve(this.config.walletsDirectoryPath, address);
		try {
			await fs.promises.writeFile(keystoreFileFullPath, JSON.stringify(keystore), 'utf8');
		} catch (error) {
			log.error(error);
		}
		const wallet = await Wallet.create({
			address: address,
			keystoreFilePath: keystoreFileFullPath,
			type: 'local'
		});

		const newWallet = {
			...wallet,
			address: address,
			privateKey: privateKey,
			keystoreFilePath: keystoreFileFullPath
		};

		return newWallet;
	}

	async copyKeystoreFile(id, toPath) {
		const wallet = await Wallet.findById(id);
		try {
			await fs.promises.copyFile(
				wallet.keystoreFilePath,
				path.resolve(toPath, wallet.address)
			);
			return true;
		} catch (error) {
			log.error(error);
			return false;
		}
	}

	async getBalance(id) {
		const wallet = await Wallet.findById(id);
		const balanceInWei = await this.web3Service.web3.eth.getBalance(wallet.address);
		return EthUnits.toEther(balanceInWei, 'wei');
	}

	async getWallets() {
		const wallets = await Wallet.findAllWithKeyStoreFile();
		return wallets.map(w => ({ ...w }));
	}

	async unlockWalletWithPassword(id, password) {
		const wallet = await Wallet.findById(id);
		let keystoreFilePath = wallet.keystoreFilePath;
		try {
			await fs.promises.access(keystoreFilePath, fs.constants.R_OK);
		} catch (error) {
			keystoreFilePath = path.resolve(this.config.walletsDirectoryPath, keystoreFilePath);
		}
		let keystore = await fs.promises.readFile(keystoreFilePath);
		const account = this.web3Service.web3.eth.accounts.decrypt(
			keystore.toString('utf8'),
			password,
			true
		);
		this.web3Service.web3.eth.accounts.wallet.add(account);
		this.web3Service.web3.eth.defaultAccount = account.address;

		if (!account) {
			throw new Error('Wrong Password!');
		}
		// testPaymentContract(wallet);
		return {
			...wallet,
			address: account.address,
			privateKey: account.privateKey
		};
	}

	async unlockWalletWithNewFile(filePath, password) {
		const keystore = await fs.promises.readFile(filePath);
		const account = this.web3Service.web3.eth.accounts.decrypt(
			keystore.toString('utf8'),
			password,
			true
		);
		this.web3Service.web3.eth.accounts.wallet.add(account);
		this.web3Service.web3.eth.defaultAccount = account.address;

		if (!account) {
			throw new Error('Wrong Password!');
		}

		const keystoreFileFullPath = path.resolve(
			this.config.walletsDirectoryPath,
			account.address
		);

		await fs.promises.copyFile(filePath, keystoreFileFullPath);

		let wallet = await Wallet.findByAddress(account.address);

		wallet = !wallet
			? await Wallet.create({
					address: account.address,
					keystoreFilePath: keystoreFileFullPath,
					type: 'local'
			  })
			: wallet;

		const newWallet = {
			...wallet,
			address: account.address,
			privateKey: account.privateKey,
			keystoreFilePath: keystoreFileFullPath
		};

		return newWallet;
	}

	async unlockWalletWithPrivateKey(privateKey) {
		if (!EthUtil.isValidPrivate(Buffer.from(privateKey.replace('0x', ''), 'hex'))) {
			throw new Error('The private key you entered is incorrect. Please try again!');
		}
		const account = this.web3Service.web3.eth.accounts.privateKeyToAccount(privateKey);
		this.web3Service.web3.eth.accounts.wallet.add(account);
		this.web3Service.web3.eth.defaultAccount = account.address;

		let wallet = await Wallet.findByAddress(account.address);

		wallet = !wallet
			? await Wallet.create({
					address: account.address,
					type: 'local'
			  })
			: wallet;

		const newWallet = {
			...wallet,
			address: account.address,
			privateKey: account.privateKey
		};

		return newWallet;
	}

	async unlockWalletWithAddress(address, path, type) {
		let wallet = await Wallet.findByAddress(address);
		this.web3Service.web3.eth.defaultAccount = address;

		wallet = !wallet
			? await Wallet.create({
					address,
					type,
					path
			  })
			: wallet;

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

	updateWalletName(name, id) {
		return Wallet.updateName({
			id,
			name: name
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
// 		wallet.address,
// 		'0xb91FF8627f30494d27b91Aac1cB3c7465BE58fF5'
// 	);
// 	const amount = 20000000000000;
// 	let gas = await ctx.selfkeyService.estimateApproveGasLimit(
// 		wallet.address,
// 		'0xb91FF8627f30494d27b91Aac1cB3c7465BE58fF5',
// 		amount
// 	);

// 	console.log('XXX pre allow', res.toString());
// 	res = await ctx.selfkeyService.approve(
// 		wallet.address,
// 		'0xb91FF8627f30494d27b91Aac1cB3c7465BE58fF5',
// 		amount,
// 		gas
// 	);
// 	console.log('XXX approve res', res.events.Approval.returnValues);
// 	res = await ctx.selfkeyService.getAllowance(
// 		wallet.address,
// 		'0xb91FF8627f30494d27b91Aac1cB3c7465BE58fF5'
// 	);
// 	console.log('XXX post approve', res.toString());
// 	const did = wallet.did;
// 	// gas = await ctx.paymentService.getGasLimit(
// 	// 	wallet.address,
// 	// 	did,
// 	// 	did,
// 	// 	10000,
// 	// 	ctx.web3Service.ensureStrHex('test'),
// 	// 	0,
// 	// 	0
// 	// );
// 	// console.log('XXX payment gas', gas);

// 	res = await ctx.paymentService.makePayment(
// 		wallet.address,
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
// 		wallet.address,
// 		'0xb91FF8627f30494d27b91Aac1cB3c7465BE58fF5'
// 	);
// 	console.log('XXX post payment', res.toString());
// }
