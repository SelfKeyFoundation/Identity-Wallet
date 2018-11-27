import TestDb from './db/test-db';
const { getUserDataPath } = require('../common/utils/common');
// const selfkeyPlatform = require('./assets/data/selfkey-platform.json');
const path = require('path');

const hasColumn = async (table, column, expected) => {
	let has = await TestDb.knex.schema.hasColumn(table, column);
	expect(has).toBe(expected);
};

const hasTable = async (table, expected) => {
	let has = await TestDb.knex.schema.hasTable(table);
	expect(has).toBe(expected);
};

// const getAttribute = url => {
// 	let found = selfkeyPlatform.attributes.filter(attr => attr.url === url);
// 	return found[0] || null;
// };

describe('migrations', () => {
	const dbFile = path.join(getUserDataPath(), 'migrationsTest.sqlite');
	beforeEach(async () => {
		await TestDb.initRaw(dbFile);
	});

	afterEach(async () => {
		await TestDb.reset();
	});

	afterAll(async () => {
		await TestDb.destroy();
	});

	describe('up 20181108183529_json-schema-attributes', () => {
		const currMigration = '20181108183529';
		const prevMigration = '20181101150000';

		it('adds repository table', async () => {
			await TestDb.migrate('up', { to: prevMigration });
			await hasTable('repository', false);
			await TestDb.migrate('up', { to: currMigration });
			await hasTable('repository', true);
			await hasColumn('repository', 'id', true);
			await hasColumn('repository', 'url', true);
			await hasColumn('repository', 'name', true);
			await hasColumn('repository', 'eager', true);
			await hasColumn('repository', 'content', true);
			await hasColumn('repository', 'expires', true);
			await hasColumn('repository', 'createdAt', true);
			await hasColumn('repository', 'updatedAt', true);
		});

		it('adds repository_attribute_types', async () => {
			await TestDb.migrate('up', { to: prevMigration });
			await hasTable('repository_attribute_types', false);
			await TestDb.migrate('up', { to: currMigration });
			await hasTable('repository_attribute_types', true);
			await hasColumn('repository_attribute_types', 'repositoryId', true);
			await hasColumn('repository_attribute_types', 'attributeTypeId', true);
		});

		it('adds ui_schema table', async () => {
			await TestDb.migrate('up', { to: prevMigration });
			await hasTable('ui_schema', false);
			await TestDb.migrate('up', { to: currMigration });
			await hasTable('repository', true);
			await hasColumn('ui_schema', 'id', true);
			await hasColumn('ui_schema', 'repositoryId', true);
			await hasColumn('ui_schema', 'attributeTypeId', true);
			await hasColumn('ui_schema', 'url', true);
			await hasColumn('ui_schema', 'content', true);
			await hasColumn('ui_schema', 'expires', true);
			await hasColumn('ui_schema', 'createdAt', true);
			await hasColumn('ui_schema', 'updatedAt', true);
		});

		it('modifyes documents table', async () => {
			await TestDb.migrate('up', { to: prevMigration });
			await hasTable('documents', true);
			await hasColumn('documents', 'attributeId', false);
			await TestDb.migrate('up', { to: currMigration });
			await hasColumn('documents', 'attributeId', true);
		});

		it('modifyes id_attributes table', async () => {
			await TestDb.migrate('up', { to: prevMigration });
			await hasTable('id_attributes', true);
			await hasColumn('id_attributes', 'documentId', true);
			await TestDb.migrate('up', { to: currMigration });
			await hasColumn('id_attributes', 'documentId', false);
		});

		it('modifies id_attribute_types', async () => {
			await TestDb.migrate('up', { to: prevMigration });
			await hasTable('id_attribute_types', true);
			await TestDb.migrate('up', { to: currMigration });
			await hasTable('id_attribute_types', true);
			await hasColumn('id_attribute_types', 'id', true);
			await hasColumn('id_attribute_types', 'url', true);
			await hasColumn('id_attribute_types', 'defaultRepositoryId', true);
			await hasColumn('id_attribute_types', 'content', true);
			await hasColumn('id_attribute_types', 'expires', true);
			await hasColumn('id_attribute_types', 'createdAt', true);
			await hasColumn('id_attribute_types', 'updatedAt', true);
		});

		it('existing documents should point to id attribute', () => {});
		describe('existing id attributes should be updated to new structure', () => {
			beforeEach(async () => {
				await TestDb.migrate('up', { to: prevMigration });
			});
			it('should migrate first name', () => {});
		});
		it('existing attribute types should migrate to json schema', () => {});
		it('default repository should be added', async () => {
			await TestDb.migrate('up', { to: currMigration });
			let initialRepos = await TestDb.knex('repository').select();
			expect(initialRepos.length).toBe(1);
			expect(initialRepos[0].url).toBe('https://platform.selfkey.org/repository.json');
		});
	});
});
