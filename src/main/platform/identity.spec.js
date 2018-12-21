import Identity from './identity';

describe('identity', () => {
	let id = null;

	beforeEach(() => {
		id = new Identity({
			publicKey: '0x1Ff482D42D8727258A1686102Fa4ba925C46Bc42',
			privateKey: 'c6cbd7d76bc5baca530c875663711b947efa6a86a900a9e8645ce32e5821484e',
			profile: 'local'
		});
	});
	it('isUnlocked', async () => {
		expect(await id.isUnlocked()).toBeTruthy();
		id.privateKey = null;
		expect(await id.isUnlocked()).toBeFalsy();
	});
	it('genSignatureForMessage', async () => {
		let signature = await id.genSignatureForMessage('test');
		expect(signature).toEqual(
			'1testc6cbd7d76bc5baca530c875663711b947efa6a86a900a9e8645ce32e5821484e1'
		);
	});
});
