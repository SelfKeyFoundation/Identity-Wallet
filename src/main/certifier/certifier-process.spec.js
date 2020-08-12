import Process from './certifier-process';
import TestDb from '../db/test-db';

describe('Process model', () => {
	const data = {
		processId: '12345',
		certifierId: 'did:selfkey:0xabc123',
		userId: 'did:selfkey:0xdef456',
		processType: 'notarization',
		processStatus: 'open',
		kycStatus: 'inProgress'
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
		await Process.create(data);
		await Process.create(data);
		const p = await Process.findAll();
	});

	it('findById', async () => {
		const p = await Process.query().insert(data);
		expect(p.id).toBeGreaterThan(0);
		const found = await Process.findById(p.id);
		expect(p).toEqual(found);
	});

	it('create', async () => {
		const p = await Process.create(data);
		const p2 = await Process.create(data);
		expect(p.id).toBeGreaterThan(0);
		expect(p2.id).toBeGreaterThan(0);
		expect(p.id).not.toBe(p2.id);
		expect(p.processId).toEqual(p2.processId);
	});

	it('update', async () => {
		const p = await Process.create(data);
		expect(p.id).toBeGreaterThan(0);
		const u = await Process.update(1, { processStatus: 'inProgress' });
		expect(u.processStatus).toEqual('inProgress');
	});

	it('delete', async () => {
		const p = await Process.create(data);
		let found = await Process.findById(p.id);
		expect(p).toEqual(found);
		await Process.delete(p.id);
		found = await Process.findById(p.id);
		expect(found).toBeUndefined();
	});
});
