import Call from './Call';
import TestDb from '../db/test-db';

describe('Call model', () => {
	const data = {
		processId: '12345',
		time: '1536209938264',
		type: 'skype',
		status: 'scheduled',
		contactType: 'skype',
		contactDetails: 'johnny_2017',
		notes: 'Skype Call to complete notarization process'
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
		await Call.create(data);
		await Call.create(data);
		const p = await Call.findAll();
	});

	it('findById', async () => {
		const p = await Call.query().insert(data);
		expect(p.id).toBeGreaterThan(0);
		const found = await Call.findById(p.id);
		expect(p).toEqual(found);
	});

	it('create', async () => {
		const p = await Call.create(data);
		const p2 = await Call.create(data);
		expect(p.id).toBeGreaterThan(0);
		expect(p2.id).toBeGreaterThan(0);
		expect(p.id).not.toBe(p2.id);
		expect(p.processId).toEqual(p2.processId);
	});

	it('update', async () => {
		const p = await Call.create(data);
		expect(p.id).toBeGreaterThan(0);
		const u = await Call.update(1, { status: 'complete' });
		expect(u.status).toEqual('complete');
	});

	it('delete', async () => {
		const p = await Call.create(data);
		let found = await Call.findById(p.id);
		expect(p).toEqual(found);
		await Call.delete(p.id);
		found = await Call.findById(p.id);
		expect(found).toBeUndefined();
	});
});
