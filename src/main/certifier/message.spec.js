import Message from './message';
import TestDb from '../db/test-db';

describe('Message model', () => {
	const data = {
		processId: '12345',
		sender: 'did:selfkey:0xabc123',
		reciever: 'did:selfkey:0xdef456',
		status: 'unread',
		message: 'hey hows it going?'
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
		await Message.create(data);
		await Message.create(data);
		const p = await Message.findAll();
	});

	it('findById', async () => {
		const p = await Message.query().insert(data);
		expect(p.id).toBeGreaterThan(0);
		const found = await Message.findById(p.id);
		expect(p).toEqual(found);
	});

	it('create', async () => {
		const p = await Message.create(data);
		const p2 = await Message.create(data);
		expect(p.id).toBeGreaterThan(0);
		expect(p2.id).toBeGreaterThan(0);
		expect(p.id).not.toBe(p2.id);
		expect(p.processId).toEqual(p2.processId);
	});

	it('update', async () => {
		const p = await Message.create(data);
		expect(p.id).toBeGreaterThan(0);
		const u = await Message.update(1, { status: 'read' });
		expect(u.status).toEqual('read');
	});

	it('delete', async () => {
		const p = await Message.create(data);
		let found = await Message.findById(p.id);
		expect(p).toEqual(found);
		await Message.delete(p.id);
		found = await Message.findById(p.id);
		expect(found).toBeUndefined();
	});
});
