import sinon from 'sinon';
import Identity from './identity';
import { getPrivateKey } from '../keystorage';
import { IdAttribute } from '../identity/id-attribute';

jest.mock('../keystorage');

describe('identity', () => {
	let id = null;
	const publicKey = '0x1Ff482D42D8727258A1686102Fa4ba925C46Bc42';
	const privateKey = 'c6cbd7d76bc5baca530c875663711b947efa6a86a900a9e8645ce32e5821484e';
	const ident = {};
	beforeEach(() => {
		id = new Identity(
			{
				publicKey,
				privateKey,
				profile: 'local',
				wid: 1
			},
			ident
		);
	});
	afterEach(() => {
		getPrivateKey.mockRestore();
		sinon.restore();
	});
	it('genSignatureForMessage', async () => {
		let signature = await id.genSignatureForMessage('test');
		expect(signature).toEqual(
			'174657374c6cbd7d76bc5baca530c875663711b947efa6a86a900a9e8645ce32e5821484e1'
		);
	});
	describe('unlock', () => {
		it('should unlock ledger', async () => {
			let id1 = new Identity(
				{
					profile: 'ledger'
				},
				ident
			);
			sinon.stub(id1, 'getPublicKeyFromHardwareWallet').returns(publicKey);
			await id1.unlock();
			expect(id1.publicKey).toEqual(publicKey);
		});
		it('should throw invalid password if failed to unlock keystore', async () => {
			let id1 = new Identity(
				{
					publicKey,
					profile: 'local'
				},
				ident
			);
			getPrivateKey.mockImplementation((filePath, password) => {
				if (password !== 'test') throw new Error('invalid pass');
				return privateKey;
			});
			try {
				await id1.unlock({ password: 'test1' });
			} catch (error) {
				expect(error.message).toBe('INVALID_PASSWORD');
			}
		});
		it('should unlock keystore', async () => {
			let id1 = new Identity(
				{
					publicKey,
					profile: 'local'
				},
				ident
			);
			getPrivateKey.mockImplementation((filePath, password) => {
				if (password !== 'test') throw new Error('invalid pass');
				return privateKey;
			});

			await id1.unlock({ password: 'test' });
			expect(id1.privateKey).toEqual(privateKey);
		});
	});
	it('getAttributesByTypes', async () => {
		sinon.stub(IdAttribute, 'findByTypeUrls').returns({
			eager() {
				return 'ok';
			}
		});

		let res = await id.getAttributesByTypes(['test1', 'test2']);

		expect(IdAttribute.findByTypeUrls.getCall(0).args).toEqual([id.wid, ['test1', 'test2']]);
		expect(res).toEqual('ok');
	});
});
