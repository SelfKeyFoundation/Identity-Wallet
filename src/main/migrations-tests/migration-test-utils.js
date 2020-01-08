import TestDb from '../db/test-db';

export const setupTestDb = (jest, dbFile = `test-db${Math.random()}.sqlite`) => {
	beforeAll(async () => {
		await TestDb.waitForLock();
	});
	beforeEach(async () => {
		await TestDb.initRaw(dbFile, true);
	});

	afterEach(async () => {
		await TestDb.reset();
	});

	afterAll(async () => {
		await TestDb.destroy();
	});
};

export const hasColumn = async (table, column, expected) => {
	let has = await TestDb.knex.schema.hasColumn(table, column);
	expect(has).toBe(expected);
};

export const hasTable = async (table, expected) => {
	let has = await TestDb.knex.schema.hasTable(table);
	expect(has).toBe(expected);
};
