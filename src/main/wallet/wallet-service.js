import { Logger } from 'common/logger';
import { getGlobalContext } from 'common/context';
import { Wallet } from './wallet';
import fs from 'fs';
import path from 'path';

const log = new Logger('wallet-model');
export class WalletService {
	constructor() {
		this.web3 = getGlobalContext().web3Service.web3;
	}

	async createWallet(password) {
		const { address, privateKey } = this.web3.eth.accounts.create();
		const keystore = this.web3.eth.accounts.encrypt(privateKey, password);
		const keystoreFileFullPath = path.resolve(
			getGlobalContext().config.walletsDirectoryPath,
			address
		);
		try {
			await fs.promises.writeFile(keystoreFileFullPath, JSON.stringify(keystore), 'utf8');
		} catch (error) {
			log.error(error);
		}
		const wallet = await Wallet.create({
			publicKey: address,
			keystoreFilePath: keystoreFileFullPath
		});

		const newWallet = {
			id: wallet.id,
			isSetupFinished: wallet.isSetupFinished,
			publicKey: address,
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
				path.resolve(toPath, wallet.publicKey)
			);
			return true;
		} catch (error) {
			log.error(error);
			return false;
		}
	}

	async getBalance(id) {
		const wallet = await Wallet.findById(id);
		return this.web3.eth.getBalance(wallet.publicKey);
	}

	async getWallets() {
		return Wallet.findAll();
	}

	async unlockWalletWithPassword(id, password) {
		const wallet = await Wallet.findById(id);
		const keystore = JSON.parse(await fs.promises.readFile(wallet.keystoreFilePath));
		const account = this.web3.eth.accounts.decrypt(keystore, password);
		if (!account) {
			throw new Error('Wrong Password!');
		}
		return {
			id: wallet.id,
			isSetupFinished: wallet.isSetupFinished,
			publicKey: account.address,
			privateKey: account.privateKey,
			keystoreFilePath: wallet.keystoreFilePath
		};
	}
}

export default WalletService;
