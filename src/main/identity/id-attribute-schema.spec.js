import IdAttributeSchema from './id-attribute-schema';
import TestDb from '../db/test-db';

describe('IdAttributeSchema', () => {
	beforeEach(async () => {
		await TestDb.init();
	});

	afterEach(async () => {
		await TestDb.reset();
	});

	afterAll(async () => {
		await TestDb.destroy();
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
