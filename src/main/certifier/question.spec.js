import Question from './question';
import TestDb from '../db/test-db';

describe('Question model', () => {
	const data = {
		processId: '12345',
		question: 'Are you a US citizen?',
		type: 'boolean',
		status: 'open',
		answer: 'true'
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
		await Question.create(data);
		await Question.create(data);
		const p = await Question.findAll();
	});

	it('findById', async () => {
		const p = await Question.query().insert(data);
		expect(p.id).toBeGreaterThan(0);
		const found = await Question.findById(p.id);
		expect(p).toEqual(found);
	});

	it('create', async () => {
		const p = await Question.create(data);
		const p2 = await Question.create(data);
		expect(p.id).toBeGreaterThan(0);
		expect(p2.id).toBeGreaterThan(0);
		expect(p.id).not.toBe(p2.id);
		expect(p.processId).toEqual(p2.processId);
	});

	it('update', async () => {
		const p = await Question.create(data);
		expect(p.id).toBeGreaterThan(0);
		const u = await Question.update(1, { status: 'complete' });
		expect(u.status).toEqual('complete');
	});

	it('delete', async () => {
		const p = await Question.create(data);
		let found = await Question.findById(p.id);
		expect(p).toEqual(found);
		await Question.delete(p.id);
		found = await Question.findById(p.id);
		expect(found).toBeUndefined();
	});
});
