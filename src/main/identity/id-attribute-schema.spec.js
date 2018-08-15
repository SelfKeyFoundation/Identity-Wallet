import IdAttributeSchema from './id-attribute-schema';
import TestDb from '../db/test-db';

describe('IdAttributeSchema', () => {
	let db;
	beforeAll(async () => {
		db = new TestDb();
		await db.init();
	});
	beforeEach(async () => {
		await db.reset();
	});
	it('sanity', async () => {
		let schema = {
			type: 'first_name',
			jsonSchema: { test: 'json' },
			uiSchema: { test: 'ui' },
			expires: 1234
		};
		let schemas = await IdAttributeSchema.query();
		expect(schemas.length).toBe(0);
		let schemaId = await IdAttributeSchema.query().insert(schema);
		let createdSchema = await IdAttributeSchema.query()
			.findById(schemaId.$id())
			.debug();
		expect(createdSchema).toMatchObject(schema);
		schemas = await IdAttributeSchema.query();
		expect(schemas.length).toBe(1);
	});
});
