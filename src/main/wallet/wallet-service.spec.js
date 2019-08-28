import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import WalletService from './wallet-service';
import Wallet from './wallet';
import EthUnits from 'common/utils/eth-units';

describe('WalletService', () => {
	let walletService;
	let web3Service;
	let config;

	beforeEach(() => {
		config = { walletsDirectoryPath: './' };
		web3Service = {
			web3: {
				eth: {
					accounts: {
						create: () => {},
						encrypt: () => {},
						decrypt: () => {},
						wallet: {
							add: () => {}
						}
					},
					defaultAccount: null,
					getBalance: () => {}
				}
			}
		};
		walletService = new WalletService({ web3Service, config });
	});
	afterEach(() => {
		sinon.restore();
	});

	describe('createWallet', () => {
		it('should create wallet', async () => {
			sinon
				.stub(web3Service.web3.eth.accounts, 'create')
				.returns({ address: 'test', privateKey: 'testPrivate' });
			sinon.stub(web3Service.web3.eth.accounts.wallet, 'add');
			sinon.stub(web3Service.web3.eth.accounts, 'encrypt').returns({ test: 'testKeystore' });
			sinon.stub(path, 'resolve').returns('testPath/test');
			sinon.stub(fs.promises, 'writeFile').resolves('ok');
			sinon.stub(Wallet, 'create').resolves({ id: 1 });

			const created = await walletService.createWallet('testPassword');

			expect(web3Service.web3.eth.accounts.create.getCall(0).args).toEqual(['testPassword']);
			expect(web3Service.web3.eth.accounts.wallet.add.getCall(0).args).toEqual([
				{ address: 'test', privateKey: 'testPrivate' }
			]);
			expect(web3Service.web3.eth.defaultAccount).toBe('test');
			expect(web3Service.web3.eth.accounts.encrypt.getCall(0).args).toEqual([
				'testPrivate',
				'testPassword'
			]);
			expect(path.resolve.getCall(0).args).toEqual([config.walletsDirectoryPath, 'test']);
			expect(fs.promises.writeFile.getCall(0).args).toEqual([
				'testPath/test',
				JSON.stringify({ test: 'testKeystore' }),
				'utf8'
			]);
			expect(created).toEqual({
				id: 1,
				address: 'test',
				privateKey: 'testPrivate',
				keystoreFilePath: 'testPath/test'
			});
		});
	});
	describe('copyKeystoreFile', () => {
		it('should copy keystore', async () => {
			sinon
				.stub(Wallet, 'findById')
				.resolves({ id: 1, keystoreFilePath: 'test', address: 'testAddress' });
			sinon.stub(path, 'resolve').returns('test new path');
			sinon.stub(fs.promises, 'copyFile').resolves('ok');
			const ret = await walletService.copyKeystoreFile(1, 'toPath');

			expect(ret).toBe(true);
			expect(fs.promises.copyFile.getCall(0).args).toEqual(['test', 'test new path']);
		});
	});

	describe('getBalance', () => {
		it('should get balance', async () => {
			sinon
				.stub(Wallet, 'findById')
				.resolves({ id: 1, keystoreFilePath: 'test', address: 'testAddress' });
			sinon.stub(web3Service.web3.eth, 'getBalance').returns(10);
			sinon.stub(EthUnits, 'toEther').returns(100);
			const balance = await walletService.getBalance(1);

			expect(balance).toBe(100);
		});
	});

	describe('getWallets', () => {
		it('should returns wallets with keystore', async () => {
			sinon.stub(Wallet, 'findAllWithKeyStoreFile').resolves([{ id: 1 }, { id: 2 }]);
			const ret = await walletService.getWallets();

			expect(ret).toEqual([{ id: 1 }, { id: 2 }]);
		});
	});

	describe('unlockWalletWithPassword', () => {
		it('should unlock a wallet with password', async () => {
			sinon.stub(Wallet, 'findById').resolves({ id: 1, keystoreFilePath: 'test' });
			sinon.stub(fs.promises, 'access').resolves('ok');
			sinon.stub(fs.promises, 'readFile').resolves({
				keystore: 'test',
				toString() {
					return 'testKeystore';
				}
			});
			sinon
				.stub(web3Service.web3.eth.accounts, 'decrypt')
				.returns({ address: 'testAddress', privateKey: 'testPrivate' });
			sinon.stub(web3Service.web3.eth.accounts.wallet, 'add');

			const ret = await walletService.unlockWalletWithPassword(1, 'test');

			expect(web3Service.web3.eth.accounts.wallet.add.getCall(0).args).toEqual([
				{ address: 'testAddress', privateKey: 'testPrivate' }
			]);
			expect(web3Service.web3.eth.defaultAccount).toBe('testAddress');
			expect(ret).toEqual({
				id: 1,
				address: 'testAddress',
				privateKey: 'testPrivate',
				keystoreFilePath: 'test'
			});
		});
	});
});
