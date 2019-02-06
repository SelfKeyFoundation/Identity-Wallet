import { Logger } from 'common/logger';
import { getGlobalContext } from 'common/context';
import { Wallet } from './wallet';
import fs from 'fs';
import path from 'path';
import { formatDataUrl, bufferFromDataUrl } from 'common/utils/document';

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
			...wallet,
			profilePicture: formatDataUrl(wallet.profilePicture),
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
		let wallet = await Wallet.findById(id);
		return this.web3.eth.getBalance(wallet.publicKey);
	}

	async getWallets() {
		const wallets = await Wallet.findAllWithKeyStoreFile();
		return wallets.map(w => ({ ...w, profilePicture: formatDataUrl(w.profilePicture) }));
	}

	async unlockWalletWithPassword(id, password) {
		const wallet = await Wallet.findById(id);
		const keystore = JSON.parse(await fs.promises.readFile(wallet.keystoreFilePath));
		const account = this.web3.eth.accounts.decrypt(keystore, password);
		if (!account) {
			throw new Error('Wrong Password!');
		}
		return {
			...wallet,
			profilePicture: formatDataUrl(wallet.profilePicture),
			publicKey: account.address,
			privateKey: account.privateKey
		};
	}

	async unlockWalletWithNewFile(filePath, password) {
		const keystore = JSON.parse(await fs.promises.readFile(filePath));
		const account = this.web3.eth.accounts.decrypt(keystore, password);
		if (!account) {
			throw new Error('Wrong Password!');
		}

		const keystoreFileFullPath = path.resolve(
			getGlobalContext().config.walletsDirectoryPath,
			account.address
		);

		await fs.promises.copyFile(filePath, keystoreFileFullPath);

		let wallet = await Wallet.findByPublicKey(account.address);

		wallet = !wallet
			? await Wallet.create({
					publicKey: account.address,
					keystoreFilePath: keystoreFileFullPath
			  })
			: wallet;

		const newWallet = {
			...wallet,
			profilePicture: formatDataUrl(wallet.profilePicture),
			publicKey: account.address,
			privateKey: account.privateKey,
			keystoreFilePath: keystoreFileFullPath
		};

		return newWallet;
	}

	async unlockWalletWithPrivateKey(privateKey) {
		const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);

		let wallet = await Wallet.findByPublicKey(account.address);

		wallet = !wallet
			? await Wallet.create({
					publicKey: account.address
			  })
			: wallet;

		const newWallet = {
			...wallet,
			profilePicture: formatDataUrl(wallet.profilePicture),
			publicKey: account.address,
			privateKey: account.privateKey
		};

		return newWallet;
	}

	async getLedgerWallets() {
		const web3Service = getGlobalContext().web3Service;
		await web3Service.switchToLedgerWallet();
		return this.web3.eth.getAccounts().map(address => {
			return {
				address,
				balance: this.web3.eth.getBalance(address)
			};
		});
	}

	updateWalletAvatar(avatar, id) {
		return Wallet.updateProfilePicture({
			id,
			profilePicture: bufferFromDataUrl(avatar)
		});
	}
}

export default WalletService;
