jest.unmock('secp256k1');
jest.unmock('ethereumjs-util');
jest.unmock('keccak');
import { HDWallet } from './hd-wallet';

describe('HDWallet', () => {
	const testMnemonic =
		'end artist warrior civil pool average afford hour episode relief pluck that';
	const testAccounts = [
		{
			address: '0x48c7f67ef5fa9e8bf415dbece669f93514a07b57',
			privateKey: '0x3ffb9c22a4d64def65a8c54821185ca8818a092c870218bf8534c268acf7ac0b',
			path: "m/44'/60'/0'/0/0"
		},
		{
			address: '0xd062ff60a182e6e62eb6428ba60ec8fc887145ff',
			privateKey: '0x234ad372ed77e910b70dad20bcadee4267488022f8221b9e399bd16af24206f6',
			path: "m/44'/60'/0'/0/1"
		},
		{
			address: '0xfa7eb1e00da270eaa3212b0d029a6e5de5bf7a3c',
			privateKey: '0x31dc7083f7aa21288ad07ced0e13c67993c6a8a6cde50f13d063dac65270d575',
			path: "m/44'/60'/0'/0/2"
		},
		{
			address: '0x12fbc3b80b2e191e2e5533c2bb3db60a446b7904',
			privateKey: '0x5e2fb346b1e6bb5cbeab17253bf89c11ed63d0c6b2e64d391272035791539ba1',
			path: "m/44'/60'/0'/0/3"
		},
		{
			address: '0x8ea2ae86b57bb6957548a0e6a47117cc09b28ab1',
			privateKey: '0xd11b9a483f78b1fa5aac118e962d022d11e0e13a2f824468eca5353f8860be80',
			path: "m/44'/60'/0'/0/4"
		},
		{
			address: '0x06d29ab3c62520b1d931f6e567a9973df5896802',
			privateKey: '0xcb44e4faddf751d91d825d755c9aa324a685e3a67577e3e06b266f7e85ba5919',
			path: "m/44'/60'/0'/0/5"
		},
		{
			address: '0xd4bcaa81b1214f55a2199498c2f0d70690e59168',
			privateKey: '0xbca892c7d7da0d62b6f5d81d74c7b3724caab4e9a97f96ee2b5aad6ea9c848d4',
			path: "m/44'/60'/0'/0/6"
		},
		{
			address: '0xf18d0eec1aed7d180c5afb22f633b2bbc200b037',
			privateKey: '0xd83bb7cc3f55e537933c6da1ff8654ed327fec99ec0ae3fe3dbe043ba899aa91',
			path: "m/44'/60'/0'/0/7"
		},
		{
			address: '0xfe293a87e4b4da33d13cd99f2416e961119ab0c0',
			privateKey: '0xf30fd4981e44cfca4b009201d21fa7daf2f81f69755067c5cf219fe66a8090ad',
			path: "m/44'/60'/0'/0/8"
		},
		{
			address: '0x8d4b046c6d0af5de4271dc5b3a501c13b2438786',
			privateKey: '0x21019c446fa01027047cba3299dfa48d8b97f22d449b12cc9b2a70d956ac69b1',
			path: "m/44'/60'/0'/0/9"
		}
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

	it('validateMnemonic', async () => {
		expect(HDWallet.validateMnemonic(testMnemonic)).toBe(true);
		expect(HDWallet.validateMnemonic('invalid mnemonic')).toBe(false);
	});
});
