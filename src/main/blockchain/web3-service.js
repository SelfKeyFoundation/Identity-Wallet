'use strict';
import Web3 from 'web3';
import { Transaction as EthereumTx } from 'ethereumjs-tx';
import AsyncTaskQueue from 'common/utils/async-task-queue';
import CONFIG from 'common/config';
import { abi as ABI } from 'main/assets/data/abi.json';
import { Logger } from 'common/logger';
import ProviderEngine from 'web3-provider-engine';
import WebsocketProvider from 'web3-provider-engine/subproviders/websocket';
import HookedWalletEthTxSubprovider from 'web3-provider-engine/subproviders/hooked-wallet-ethtx';
import SubscriptionSubprovider from 'web3-provider-engine/subproviders/subscriptions';
// import FetchSubprovider from 'web3-provider-engine/subproviders/fetch';
import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import Web3SubProvider from '@ledgerhq/web3-subprovider';
import TrezorWalletSubProviderFactory from 'trezor-wallet-provider';
import { EventEmitter } from 'events';

const log = new Logger('Web3Service');

export const REQUEST_INTERVAL_DELAY = 500;

export const SERVER_CONFIG = {
	infura: {
		1: { url: 'wss://mainnet.infura.io/ws/v3/2e5fb5cf42714929a7f61a1617ef1ffd' },
		3: { url: 'wss://ropsten.infura.io/ws/v3/39ee901210ff4dabbe18e296d9a7a366' }
	}
};

/*
export const SERVER_CONFIG = {
	infura: {
		1: { url: 'https://ropsten.infura.io/v3/39ee901210ff4dabbe18e296d9a7a366' },
		3: { url: 'https://ropsten.infura.io/v3/39ee901210ff4dabbe18e296d9a7a366' }
	}
};
*/

export const SELECTED_SERVER_URL = SERVER_CONFIG[CONFIG.node][CONFIG.chainId].url;

export class Web3Service extends EventEmitter {
	constructor(ctx = {}) {
		super();
		this.defaultWallet();
		this.store = ctx.store;
		this.q = new AsyncTaskQueue(this.handleTicket.bind(this), REQUEST_INTERVAL_DELAY);
		this.nonce = 0;
		this.abi = ABI;
	}

	getWalletEthTxSubprovider() {
		return new HookedWalletEthTxSubprovider({
			getAccounts: callback => {
				callback(null, [this.web3.eth.defaultAccount]);
			},
			getPrivateKey: (address, callback) => {
				if (address.toLowerCase() === this.web3.eth.defaultAccount.toLowerCase()) {
					return callback(
						null,
						Buffer.from(
							this.web3.eth.accounts.wallet[address].privateKey.replace('0x', ''),
							'hex'
						)
					);
				}
				return callback(new Error('not private key supplied for that account'));
			}
		});
	}

	async defaultWallet() {
		if (this.web3 && this.web3.currentProvider) {
			this.web3.currentProvider.stop();
		}
		const engine = new ProviderEngine({ pollingInterval: 2000000 });

		engine.addProvider(this.getWalletEthTxSubprovider());
		engine.addProvider(new WebsocketProvider({ rpcUrl: SELECTED_SERVER_URL }));
		engine.on('error', error => {
			log.error('Web3Service provider error %s', error);
		});
		engine.on('start', async () => {
			await this.web3.eth.getBlockNumber();
		});
		engine.on('block', block => this.emit('block', block));
		engine.start();

		this.web3 = new Web3(engine);
		this.web3.transactionConfirmationBlocks = 1;
	}

	async switchToLedgerWallet(accountsOffset = 0, accountsQuantity = 6) {
		if (this.web3 && this.web3.currentProvider) {
			this.web3.currentProvider.stop();
		}
		const engine = new ProviderEngine({ pollingInterval: 2000000 });
		this.getLedgerTransport = () => HWTransportNodeHid.create();
		// ledger firmware 1.6 changed the path derivation scheme to be "44'/60'/x'/0/0"
		// to support legacy accounts, we will also search accounts in previous path scheme "44'/60'/0'/x"
		this.ledgerConfig = {
			networkId: CONFIG.chainId,
			accountsLength: accountsQuantity,
			accountsOffset: accountsOffset,
			paths: ["44'/60'/x'/0/0", "44'/60'/0'/x"]
		};
		this.ledgerWalletSubProvider = Web3SubProvider(this.getLedgerTransport, this.ledgerConfig);

		const subscriptionSubprovider = new SubscriptionSubprovider();

		engine.addProvider(this.ledgerWalletSubProvider);
		engine.addProvider(subscriptionSubprovider);
		engine.addProvider(new WebsocketProvider({ rpcUrl: SELECTED_SERVER_URL }));
		engine.on('error', error => {
			log.error('Web3Service provider error %s', error);
		});
		this.web3 = new Web3(engine);
		engine.on('start', async () => {
			await this.web3.eth.getBlockNumber();
		});
		engine.start();
		this.web3.transactionConfirmationBlocks = 1;
	}

	createAccount(password) {
		return this.web3.eth.accounts.create(password);
	}

	setDefaultAccount(account) {
		this.defaultWallet();
		this.web3.eth.accounts.wallet.add(account);
		this.setDefaultAddress(account.address);
	}

	setDefaultAddress(address) {
		this.web3.eth.defaultAccount = address;
	}

	encryptAccount(account, password) {
		const { privateKey } = account;
		return this.web3.eth.accounts.encrypt(privateKey, password);
	}

	decryptAccount(keystore, password) {
		return this.web3.eth.accounts.decrypt(keystore.toString('utf8'), password, true);
	}

	privateKeyToAccount(privateKey) {
		return this.web3.eth.accounts.privateKeyToAccount(privateKey);
	}

	async switchToTrezorWallet(accountsOffset = 0, accountsQuantity = 6, eventEmitter) {
		if (this.web3 && this.web3.currentProvider) {
			this.web3.currentProvider.stop();
		}
		this.trezorWalletSubProvider = await TrezorWalletSubProviderFactory(
			CONFIG.chainId,
			accountsOffset,
			accountsQuantity,
			eventEmitter
		);
		const engine = new ProviderEngine({ pollingInterval: 2000000 });

		const subscriptionSubprovider = new SubscriptionSubprovider();

		engine.on('error', error => {
			log.error('Web3Service provider error %s', error);
		});
		engine.addProvider(this.trezorWalletSubProvider);
		engine.addProvider(subscriptionSubprovider);
		engine.addProvider(new WebsocketProvider({ rpcUrl: SELECTED_SERVER_URL }));
		this.web3 = new Web3(engine);
		engine.on('start', async () => {
			// block tracking does not work if not manually started for some reason
			// causing incorrect balances to be returned on getBalance call
			await this.web3.eth.getBlockNumber();
		});
		engine.start();
		this.web3.transactionConfirmationBlocks = 1;
	}

	async handleTicket(data) {
		log.debug('handle ticket %2j', data);
		const {
			contractAddress,
			contractMethod,
			method,
			customWeb3,
			customAbi,
			contractMethodArgs = [],
			wallet = null,
			args = []
		} = data;
		const { Contract } = this.web3.eth;
		const web3 = customWeb3 || this.web3;
		let contract = web3.eth;
		if (args[0]) {
			if (args[0].gas && typeof args[0].gas === 'number') {
				args[0].gas = Math.round(args[0].gas);
			}
			if (args[0].gasPrice && typeof args[0].gasPrice === 'number') {
				args[0].gasPrice = Math.round(args[0].gasPrice);
			}
		}
		if (contractAddress) {
			contract = new Contract(customAbi || ABI, contractAddress);
			if (contractMethod) {
				contract = contract.methods[contractMethod](...contractMethodArgs);
			}
		}
		if (method === 'send') {
			return {
				...(await this.sendSignedTransaction(contract, contractAddress, args, wallet))
			};
		}

		return { ticketPromise: contract[method](...args) };
	}
	getSelectedServerURL() {
		return SELECTED_SERVER_URL;
	}
	waitForTicket(args) {
		return new Promise(async (resolve, reject) => {
			try {
				let res = await this.q.push(args);
				let ticketPromise = res.ticketPromise;
				if (!ticketPromise) {
					return reject(new Error('Failed to process ticket'));
				}
				const errorHandler = err => {
					this.nonce = 0;
					log.error('web3 response error %s', err);
					reject(err);
				};
				ticketPromise.catch(errorHandler);

				if (args.onceListenerName) {
					ticketPromise.once(args.onceListenerName, res => {
						resolve(res);
					});
				} else {
					ticketPromise.then(res => {
						resolve(res);
					});
				}
			} catch (error) {
				if (error.method && error.method !== 'call') {
					log.error('waitForTicket error %s %2j', error, args);
				}
				reject(error);
			}
		});
	}
	getTransaction(hash) {
		return this.waitForTicket({
			method: 'getTransaction',
			args: [hash]
		});
	}
	getTransactionReceipt(hash) {
		return this.waitForTicket({
			method: 'getTransactionReceipt',
			args: [hash]
		});
	}
	ensureStrHex(str) {
		if (!this.web3.utils.isHex(str)) {
			return this.web3.utils.asciiToHex(str);
		}
		return str;
	}
	ensureIntHex(num) {
		if (!this.web3.utils.isHex(num)) {
			return this.web3.utils.numberToHex(num);
		}
		return num;
	}

	/**
	 * Get transaction status
	 *
	 * @param {Transaction} tx transaction
	 * @return {string} status
	 */
	async getTransactionStatus(tx) {
		try {
			if (!tx) {
				return 'pending';
			}
			if (!tx.blockNumber) {
				return 'processing';
			}
			let receipt = await this.getTransactionReceipt(tx.hash);
			let status = receipt.status;
			if (typeof status !== 'boolean') {
				status = this.web3.utils.hexToNumber(receipt.status);
			}
			if (!status) {
				return 'failed';
			}
			return 'success';
		} catch (error) {
			log.error('getTransactionStatus %s', error);
			return 'failed';
		}
	}

	/**
	 * Given a transaction hash return the transaction status
	 *
	 * @param {string} hash
	 * @return {string} status
	 */
	async checkTransactionStatus(hash) {
		const tx = await this.getTransaction(hash);
		return this.getTransactionStatus(tx);
	}

	async getNextNonce(address, opt) {
		opt = opt || {};
		let block = 'pending';

		if (opt.block) {
			block = opt.block;
		}

		let nonce = await this.web3.eth.getTransactionCount(address, block);
		if (nonce <= this.nonce) {
			return this.nonce;
		}
	}

	async sendSignedTransaction(contactMethodInstance, contractAdress, args, wallet) {
		let opts = { ...(args || [])[0] };
		if (!opts.from) {
			throw new Error('src address is not defined');
		}
		if (!wallet) {
			wallet = this.store.getState().wallet;
		}
		if (!wallet || wallet.address !== opts.from) {
			throw new Error('provided wallet does not contain requested address');
		}
		if ((wallet.profile && wallet.profile !== 'local') || wallet.isHardwareWallet) {
			return contactMethodInstance.send(...args);
		}
		if (!wallet.privateKey) {
			throw new Error('the wallet provided is not unlocked');
		}

		if (!opts.gasPrice) {
			opts.gasPrice = await this.web3.eth.getGasPrice();
		}
		opts.gasPrice = this.web3.utils.toHex(Math.round(opts.gasPrice));
		if (!opts.gas) {
			opts.gas = await contactMethodInstance.estimateGas({
				from: opts.from,
				value: this.web3.utils.toHex(0)
			});
		}
		let data = contactMethodInstance.encodeABI();
		let nonce = await this.getNextNonce();
		let rawTx = {
			nonce: this.web3.utils.toHex(nonce),
			to: contractAdress,
			value: this.web3.utils.toHex(0),
			data,
			chainId: CONFIG.chainId,
			...opts
		};
		const tx = new EthereumTx(rawTx, { chain: CONFIG.chainId });
		tx.sign(Buffer.from(wallet.privateKey.replace('0x', ''), 'hex'));
		let serializedTx = '0x' + tx.serialize().toString('hex');
		this.nonce = nonce;
		return {
			ticketPromise: this.web3.eth.sendSignedTransaction(serializedTx)
		};
	}
}

export default Web3Service;
