jest.unmock('secp256k1');
jest.unmock('ethereumjs-util');
jest.unmock('keccak');
import { HDWallet } from './hd-wallet';

describe('HDWallet', () => {
	const testMnemonic =
		'end artist warrior civil pool average afford hour episode relief pluck that';
	const testAccounts = [
		{ address: '0x48c7f67ef5fa9e8bf415dbece669f93514a07b57', path: "m/44'/60'/0'/0/0" },
		{ address: '0xd062ff60a182e6e62eb6428ba60ec8fc887145ff', path: "m/44'/60'/0'/0/1" },
		{ address: '0xfa7eb1e00da270eaa3212b0d029a6e5de5bf7a3c', path: "m/44'/60'/0'/0/2" },
		{ address: '0x12fbc3b80b2e191e2e5533c2bb3db60a446b7904', path: "m/44'/60'/0'/0/3" },
		{ address: '0x8ea2ae86b57bb6957548a0e6a47117cc09b28ab1', path: "m/44'/60'/0'/0/4" },
		{ address: '0x06d29ab3c62520b1d931f6e567a9973df5896802', path: "m/44'/60'/0'/0/5" },
		{ address: '0xd4bcaa81b1214f55a2199498c2f0d70690e59168', path: "m/44'/60'/0'/0/6" },
		{ address: '0xf18d0eec1aed7d180c5afb22f633b2bbc200b037', path: "m/44'/60'/0'/0/7" },
		{ address: '0xfe293a87e4b4da33d13cd99f2416e961119ab0c0', path: "m/44'/60'/0'/0/8" },
		{ address: '0x8d4b046c6d0af5de4271dc5b3a501c13b2438786', path: "m/44'/60'/0'/0/9" }
	];

	it('getPathForAccountIdx', () => {
		expect(HDWallet.getPathForAccountIdx()).toEqual("m/44'/60'/0'/0/0");
		expect(HDWallet.getPathForAccountIdx(8)).toEqual("m/44'/60'/0'/0/8");
		expect(HDWallet.getPathForAccountIdx(8, `m/44'/60'/x'/0/0`)).toEqual("m/44'/60'/8'/0/0");
		expect(HDWallet.getPathForAccountIdx(199, `m/44'/60'/0'/x/0`)).toEqual(
			"m/44'/60'/0'/199/0"
		);
	});
	it('Should generate random mnemonic', () => {
		const mneminic1 = HDWallet.generateMnemonic();
		const mnemonic2 = HDWallet.generateMnemonic();

		expect(mneminic1).not.toEqual(mnemonic2);
		expect(mneminic1).not.toEqual(testMnemonic);
		expect(mnemonic2).not.toEqual(testMnemonic);
	});
	it('Expect to create wallet', async () => {
		const mnemonic = HDWallet.generateMnemonic();
		const hdWallet = await HDWallet.createFromMnemonic(mnemonic);
		const wallet = hdWallet.createWallet(HDWallet.getPathForAccountIdx(0));

		expect(wallet.address).toBeDefined();
		expect(wallet.privateKey).toBeDefined();
	});

	it('Expect to create wallet from private key', async () => {
		const hdWallet = await HDWallet.createFromMnemonic(testMnemonic);
		const { xpriv, xpub } = hdWallet.toJSON();
		const newBuilder = await HDWallet.createFromJSON({ xpriv, xpub });

		expect(newBuilder.root.privateKey).toEqual(hdWallet.root.privateKey);
		expect(newBuilder.root.publicKey).toEqual(hdWallet.root.publicKey);
	});

	it('getAccounts', async () => {
		const hdWallet = await HDWallet.createFromMnemonic(testMnemonic);
		const accounts = hdWallet.getAccounts();
		expect(accounts).toEqual(testAccounts);
	});
});
