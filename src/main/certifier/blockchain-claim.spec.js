import BlockchainClaim from './blockchain-claim';
import TestDb from '../db/test-db';

describe('Blockchain Claim model', () => {
	const data = {
		processId: '12345',
		certifierId: '0xabc123',
		userId: '0xdef456',
		type: 'notarization',
		status: 'pending',
		key: 'is_us_citizen',
		value: 'true',
		expires: '1536209938264'
	};

	beforeEach(async () => {
		await TestDb.init();
	});

	afterEach(async () => {
		await TestDb.reset();
	});

	afterAll(async () => {
		await TestDb.destroy();
	});

	it('findAll basic', async () => {
		await BlockchainClaim.create(data);
		await BlockchainClaim.create(data);
		const p = await BlockchainClaim.findAll();
	});

	it('findById', async () => {
		const p = await BlockchainClaim.query().insert(data);
		expect(p.id).toBeGreaterThan(0);
		const found = await BlockchainClaim.findById(p.id);
		expect(p).toEqual(found);
	});

	it('create', async () => {
		const p = await BlockchainClaim.create(data);
		const p2 = await BlockchainClaim.create(data);
		expect(p.id).toBeGreaterThan(0);
		expect(p2.id).toBeGreaterThan(0);
		expect(p.id).not.toBe(p2.id);
		expect(p.processId).toEqual(p2.processId);
	});

	it('update', async () => {
		const p = await BlockchainClaim.create(data);
		expect(p.id).toBeGreaterThan(0);
		const u = await BlockchainClaim.update(1, { status: 'complete' });
		expect(u.status).toEqual('complete');
	});
});
