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

		describe('existing id attributes should be updated to new structure', () => {
			beforeEach(async () => {
				await TestDb.migrate('up', { to: prevMigration });
			});
			it('should migrate simple value', async () => {
				await TestDb.knex('id_attribute_types').insert({
					key: 'first_name',
					category: 'global_attribute',
					type: 'static_data',
					entity: '["individual"]',
					createdAt: 0,
					isInitial: 1
				});
				await TestDb.knex('id_attributes').insert({
					id: 1,
					walletId: 1,
					type: 'first_name',
					data: '{"value":"First Name"}',
					createdAt: 0,
					documentId: null
				});
				await TestDb.migrate('up', { to: currMigration });
				let newAttr = await TestDb.knex('id_attributes')
					.select()
					.where({ id: 1 });

				expect(newAttr[0]).toEqual({
					id: 1,
					walletId: 1,
					typeId: 1,
					data: '{"value":"First Name"}',
					createdAt: 0,
					name: 'first_name',
					updatedAt: null
				});
			});
			it('should migrate address', async () => {
				await TestDb.knex('id_attribute_types').insert({
					key: 'physical_address',
					category: 'global_attribute',
					type: 'static_data',
					entity: '["individual"]',
					createdAt: 0,
					isInitial: 0
				});
				await TestDb.knex('id_attribute_types').insert({
					key: 'work_place',
					category: 'global_attribute',
					type: 'static_data',
					entity: '["individual"]',
					createdAt: 0,
					isInitial: 0
				});

				await TestDb.knex('id_attributes').insert({
					id: 9,
					walletId: 1,
					type: 'physical_address',
					data:
						'{"address1":"street address 1","address2":"street address 2","city":"city","country":"Anguilla","region":"state","zip":"zip"}',
					documentId: null,
					createdAt: 0
				});
				await TestDb.knex('id_attributes').insert({
					id: 10,
					walletId: 1,
					type: 'work_place',
					data:
						'{"address1":"workplace str 1","address2":"workplace str 2","city":"workplace city","country":"Andorra","region":"workplace state","zip":"workplace zip"}',
					documentId: null,
					createdAt: 0
				});
				await TestDb.migrate('up', { to: currMigration });
				let newType = await TestDb.knex('id_attribute_types').select();
				let newAttr = await TestDb.knex('id_attributes').select();

				newAttr = newAttr.map(attr => {
					attr.data = JSON.parse(attr.data);
					return attr;
				});
				expect(newAttr.length).toBe(2);
				expect(newType.length).toBe(1);

				expect(newAttr[0].typeId).toBe(newType[0].id);
				expect(newAttr[0].name).toEqual('physical_address');
				expect(newAttr[0].data.value).toEqual({
					'address-line-1': 'street address 1',
					'address-line-2': 'street address 2',
					'address-line-3': 'zip, city, state, Anguilla'
				});
				expect(newAttr[1].typeId).toEqual(newType[0].id);
				expect(newAttr[1].name).toEqual('work_place');
				expect(newAttr[1].data.value).toEqual({
					'address-line-1': 'workplace str 1',
					'address-line-2': 'workplace str 2',
					'address-line-3': 'workplace zip, workplace city, workplace state, Andorra'
				});
			});
			it('should migrate work address', async () => {
				await TestDb.knex('id_attribute_types').insert({
					key: 'work_place',
					category: 'global_attribute',
					type: 'static_data',
					entity: '["individual"]',
					createdAt: 0,
					isInitial: 0
				});

				await TestDb.knex('id_attributes').insert({
					id: 10,
					walletId: 1,
					type: 'work_place',
					data:
						'{"address1":"workplace str 1","address2":"workplace str 2","city":"workplace city","country":"Andorra","region":"workplace state","zip":"workplace zip"}',
					documentId: null,
					createdAt: 0
				});
				await TestDb.migrate('up', { to: currMigration });
				let newType = await TestDb.knex('id_attribute_types').select();
				let newAttr = await TestDb.knex('id_attributes').select();

				newAttr = newAttr.map(attr => {
					attr.data = JSON.parse(attr.data);
					return attr;
				});
				expect(newAttr.length).toBe(1);
				expect(newType.length).toBe(1);

				expect(newAttr[0].typeId).toBe(newType[0].id);
				expect(newType[0].url).toEqual(
					'https://platform.selfkey.org/schema/attribute/physical-address.json'
				);
				expect(newAttr[0].data.value).toEqual({
					'address-line-1': 'workplace str 1',
					'address-line-2': 'workplace str 2',
					'address-line-3': 'workplace zip, workplace city, workplace state, Andorra'
				});
			});
			it('should migrate phone number', async () => {
				await TestDb.knex('id_attribute_types').insert({
					key: 'phonenumber_countrycode',
					category: 'global_attribute',
					type: 'static_data',
					entity: '["company","individual"]',
					isInitial: 0,
					createdAt: 0
				});
				await TestDb.knex('id_attributes').insert({
					id: 14,
					walletId: 1,
					type: 'phonenumber_countrycode',
					data: '{"countryCode":"+355","telephoneNumber":12312123123123}',
					documentId: null,
					createdAt: 0
				});
				await TestDb.migrate('up', { to: currMigration });
				let newType = await TestDb.knex('id_attribute_types').select();
				let newAttr = await TestDb.knex('id_attributes').select();

				newAttr = newAttr.map(attr => {
					attr.data = JSON.parse(attr.data);
					return attr;
				});

				expect(newAttr[0].typeId).toBe(newType[0].id);
				expect(newAttr[0].name).toEqual('phonenumber_countrycode');

				expect(newAttr[0].data).toEqual({ value: '+35512312123123123' });
			});
			it('should migrate simple documents', async () => {
				await TestDb.knex('id_attribute_types').insert({
					key: 'fingerprint',
					category: 'global_attribute',
					type: 'document',
					entity: '["individual"]',
					isInitial: 0,
					createdAt: 0
				});
				await TestDb.knex('id_attribute_types').insert({
					key: 'voice_id',
					category: 'global_attribute',
					type: 'document',
					entity: '["individual"]',
					isInitial: 0,
					createdAt: 0
				});
				await TestDb.knex('id_attributes').insert({
					id: 15,
					walletId: 1,
					type: 'fingerprint',
					data: '{}',
					documentId: 3,
					createdAt: 0
				});
				await TestDb.knex('id_attributes').insert({
					id: 16,
					walletId: 1,
					type: 'voice_id',
					data: '{}',
					documentId: 4,
					createdAt: 0
				});
				await TestDb.knex('documents').insert({
					id: 3,
					name: 'Screen Shot 2018-11-16 at 17.12.55.png',
					mimeType: 'image/png',
					size: 17065,
					buffer: Buffer.alloc(17065),
					createdAt: 0
				});
				await TestDb.knex('documents').insert({
					id: 4,
					name: 'Screen Shot 2018-11-16 at 17.12.55.png',
					mimeType: 'image/png',
					size: 17065,
					buffer: Buffer.alloc(17065),
					createdAt: 0
				});
				await TestDb.migrate('up', { to: currMigration });
				let newType = await TestDb.knex('id_attribute_types').select();
				let newAttr = await TestDb.knex('id_attributes').select();
				let newDocs = await TestDb.knex('documents').select();

				newAttr = newAttr.map(attr => {
					attr.data = JSON.parse(attr.data);
					return attr;
				});

				expect(newAttr[0].typeId).toBe(newType[0].id);
				expect(newAttr[0].data).toEqual({
					value: {
						image: '$document-3'
					}
				});
				expect(newAttr[1].typeId).toBe(newType[1].id);
				expect(newAttr[1].data).toEqual({
					value: {
						audio: '$document-4'
					}
				});
				expect(newDocs[0].attributeId).toBe(newAttr[0].id);
				expect(newDocs[1].attributeId).toBe(newAttr[1].id);
			});
			it('should migrate drivers license', async () => {
				await TestDb.knex('id_attribute_types').insert({
					key: 'drivers_license',
					category: 'id_document',
					type: 'document',
					entity: '["individual"]',
					isInitial: 0,
					createdAt: 0
				});

				await TestDb.knex('id_attributes').insert({
					id: 18,
					walletId: 1,
					type: 'drivers_license',
					data: '{}',
					documentId: 6,
					createdAt: 0
				});
				await TestDb.knex('documents').insert({
					id: 6,
					name: 'Screen Shot 2018-11-16 at 15.27.17.png',
					mimeType: 'image/png',
					size: 3711637,
					buffer: Buffer.alloc(3711637),
					createdAt: 0
				});
				await TestDb.migrate('up', { to: currMigration });
				let newType = await TestDb.knex('id_attribute_types').select();
				let newAttr = await TestDb.knex('id_attributes').select();
				let newDocs = await TestDb.knex('documents').select();

				newAttr = newAttr.map(attr => {
					attr.data = JSON.parse(attr.data);
					return attr;
				});

				expect(newAttr[0].typeId).toBe(newType[0].id);
				expect(newAttr[0].data).toEqual({
					value: {
						front: '$document-6'
					}
				});
				expect(newDocs[0].attributeId).toBe(newAttr[0].id);
			});
			it('should migrate national id', async () => {
				await TestDb.knex('id_attribute_types').insert({
					key: 'national_id',
					category: 'id_document',
					type: 'document',
					entity: '["individual"]',
					isInitial: 0,
					createdAt: 0
				});

				await TestDb.knex('id_attributes').insert({
					id: 18,
					walletId: 1,
					type: 'national_id',
					data: '{}',
					documentId: 6,
					createdAt: 0
				});
				await TestDb.knex('documents').insert({
					id: 6,
					name: 'Screen Shot 2018-11-16 at 15.27.17.png',
					mimeType: 'image/png',
					size: 3711637,
					buffer: Buffer.alloc(3711637),
					createdAt: 0
				});
				await TestDb.knex('id_attribute_types').insert({
					key: 'national_id_back',
					category: 'id_document',
					type: 'document',
					entity: '["individual"]',
					isInitial: 0,
					createdAt: 0
				});

				await TestDb.knex('id_attributes').insert({
					id: 19,
					walletId: 1,
					type: 'national_id_back',
					data: '{}',
					documentId: 7,
					createdAt: 0
				});
				await TestDb.knex('documents').insert({
					id: 7,
					name: 'Screen Shot 2018-11-16 at 15.27.17.png',
					mimeType: 'image/png',
					size: 3711637,
					buffer: Buffer.alloc(3711637),
					createdAt: 0
				});
				await TestDb.migrate('up', { to: currMigration });
				let newType = await TestDb.knex('id_attribute_types').select();
				let newAttr = await TestDb.knex('id_attributes').select();
				let newDocs = await TestDb.knex('documents').select();

				newAttr = newAttr.map(attr => {
					attr.data = JSON.parse(attr.data);
					return attr;
				});
				expect(newType.length).toBe(1);
				expect(newAttr.length).toBe(1);
				expect(newDocs.length).toBe(2);
				expect(newAttr[0].typeId).toBe(newType[0].id);
				expect(newAttr[0].data).toEqual({
					value: {
						front: '$document-6',
						back: '$document-7',
						additional: []
					}
				});
				expect(newDocs[0].attributeId).toBe(newAttr[0].id);
			});
		});

		it('default repository should be added', async () => {
			await TestDb.migrate('up', { to: currMigration });
			let initialRepos = await TestDb.knex('repository').select();
			expect(initialRepos.length).toBe(1);
			expect(initialRepos[0].url).toBe('https://platform.selfkey.org/repository.json');
		});
	});
});
