import ClaimDocument from './claim-document';
import TestDb from '../db/test-db';

describe('Claim Document model', () => {
	const schema = {
		$id: 'http://example.com/schema-v1.json',
		$schema: 'http://json-schema.org/draft-07/schema#',
		type: 'object',
		properties: {
			id: {
				type: 'string'
			},
			name: {
				type: 'string'
			},
			description: {
				type: 'string'
			}
		},
		required: ['id', 'name'],
		additionalProperties: false
	};

	const data = {
		id: '12345',
		name: 'bob'
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
		await ClaimDocument.create(data, schema);
		await ClaimDocument.create(data, schema);
		const p = await ClaimDocument.findAll();
	});

	it('findById', async () => {
		const p = await ClaimDocument.create(data, schema);
		console.log(p);
		expect(p.id).toBeGreaterThan(0);
		const found = await ClaimDocument.findById(p.id);
		console.log(found);
		expect(p).toEqual(found);
	});

	it('create', async () => {
		const p = await ClaimDocument.create(data, schema);
		const p2 = await ClaimDocument.create(data, schema);
		expect(p.id).toBeGreaterThan(0);
		expect(p2.id).toBeGreaterThan(0);
		expect(p.id).not.toBe(p2.id);
		expect(p.type).toEqual(p2.type);
	});

	it('delete', async () => {
		const p = await ClaimDocument.create(data, schema);
		let found = await ClaimDocument.findById(p.id);
		expect(p).toEqual(found);
		await ClaimDocument.delete(p.id);
		found = await ClaimDocument.findById(p.id);
		expect(found).toBeUndefined();
	});
});
