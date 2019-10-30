import TestDb from '../db/test-db';
import { setupTestDb, hasTable } from './migration-test-utils';

const insertWalletData = async walletId => {
	await TestDb.knex('wallet_tokens').insert([
		{ walletId, tokenId: 'KEY' },
		{ walletId, tokenId: 'CBS' }
	]);

	await TestDb.knex('wallet_settings').insert({
		sowDesktopNotifications: 1,
		walletId,
		createdAt: Date.now()
	});

	await TestDb.knex('address_book').insert({
		walletId,
		label: 'test',
		address: 'test',
		createdAt: Date.now()
	});
	const identityId = (await TestDb.knex('identities').insert({
		walletId,
		type: 'individual',
		createdAt: Date.now()
	}))[0];

	await TestDb.knex('marketplace_orders').insert({
		walletId,
		identityId,
		itemId: 1,
		createdAt: Date.now()
	});

	const attributeId = (await TestDb.knex('id_attributes').insert({
		identityId,
		typeId: 1,
		name: 'test',
		createdAt: Date.now()
	}))[0];

	await TestDb.knex('documents').insert({
		attributeId,
		name: 'test',
		mimeType: 'test',
		size: 10,
		buffer: 'test',
		createdAt: Date.now()
	});
};

const hasWalletData = async (walletId, expected) => {
	const identities = await TestDb.knex('identities')
		.select()
		.where({ walletId });

	const tokens = await TestDb.knex('wallet_tokens')
		.select()
		.where({ walletId });
	const settings = await TestDb.knex('wallet_settings')
		.select()
		.where({ walletId });

	const addresses = await TestDb.knex('address_book')
		.select()
		.where({ walletId });

	const marketplaceOrders = await TestDb.knex('marketplace_orders')
		.select()
		.where({ walletId });

	if (!expected) {
		expect(identities.length).toBe(0);
		expect(tokens.length).toBe(0);
		expect(settings.length).toBe(0);
		expect(addresses.length).toBe(0);
		expect(marketplaceOrders.length).toBe(0);
		return;
	}

	expect(identities.length).toBe(1);
	expect(tokens.length).toBe(2);
	expect(settings.length).toBe(1);
	expect(addresses.length).toBe(1);
	expect(marketplaceOrders.length).toBe(1);

	const attributes = await TestDb.knex('id_attributes')
		.select()
		.where({ identityId: identities[0].id });

	expect(attributes.length).toBe(1);

	const documents = await TestDb.knex('documents')
		.select()
		.where({ attributeId: attributes[0].id });

	expect(documents.length).toBe(1);
};

const createOldWallets = async () => {
	await TestDb.knex.schema.createTable('wallets_old', table => {
		table.increments('id');
		table.string('name');
		table
			.string('publicKey')
			.unique()
			.notNullable();
		table.string('privateKey');
		table.string('keystoreFilePath');
		table.binary('profilePicture');
		table
			.integer('isSetupFinished')
			.notNullable()
			.defaultTo(0);
		table
			.string('profile')
			.notNullable()
			.defaultTo('local');
		table.string('path');
		table.string('did');
		table.integer('createdAt').notNullable();
		table.integer('updatedAt');
	});
};

describe('migrations', () => {
	setupTestDb(jest);
	describe('up 20191014104425_fix_wallets_migration', () => {
		const currMigration = '20191014104425';
		const prevMigration = '20191001161321';
		const testWallets = [
			{ address: 'test1', createdAt: Date.now() },
			{ address: 'test2', createdAt: Date.now() }
		];
		const testOldWallets = [
			{ publicKey: 'test1', createdAt: Date.now() },
			{ publicKey: 'test2', createdAt: Date.now() }
		];
		it('does not have wallets_old', async () => {
			await TestDb.migrate('up', { to: prevMigration });
			await TestDb.knex('wallets').insert(testWallets);
			let wallets = await TestDb.knex('wallets').select();
			await TestDb.migrate('up', { to: currMigration });
			let newWallets = await TestDb.knex('wallets').select();
			expect(wallets).toEqual(newWallets);
			hasTable('wallets_old', false);
		});
		it('wallets is empty', async () => {
			await TestDb.migrate('up', { to: prevMigration });
			await createOldWallets();
			await TestDb.knex('wallets_old').insert(testOldWallets);
			await TestDb.migrate('up', { to: currMigration });
			let newWallets = await TestDb.knex('wallets').select();
			expect(newWallets.length).toEqual(2);
			hasTable('wallets_old', false);
		});
		it("wallets doesn't have conflicts", async () => {
			await TestDb.migrate('up', { to: prevMigration });

			await TestDb.knex('wallets').insert(testWallets);
			let wallets = await TestDb.knex('wallets').select();

			const oldWallets = testOldWallets.map((w, index) => ({
				...w,
				publicKey: w.publicKey + '1',
				id: index + wallets.length + 1
			}));

			await createOldWallets();
			await TestDb.knex('wallets_old').insert(oldWallets);

			await TestDb.migrate('up', { to: currMigration });

			let newWallets = await TestDb.knex('wallets').select();
			expect(newWallets.length).toEqual(4);
			expect(newWallets).toContainEqual(wallets[0]);
			expect(newWallets).toContainEqual(wallets[1]);
			hasTable('wallets_old', false);
		});
		it('wallets has conflict with same address and id', async () => {
			await TestDb.migrate('up', { to: prevMigration });

			await TestDb.knex('wallets').insert(testWallets);
			let wallets = await TestDb.knex('wallets').select();

			await insertWalletData(wallets[0].id);

			const oldWallets = testOldWallets.map((w, index) => ({
				...w,
				publicKey: w.publicKey + '1',
				id: index + wallets.length + 1
			}));

			oldWallets[0].id = wallets[0].id;
			oldWallets[0].publicKey = wallets[0].address;

			await createOldWallets();
			await TestDb.knex('wallets_old').insert(oldWallets);

			await TestDb.migrate('up', { to: currMigration });

			let newWallets = await TestDb.knex('wallets').select();
			expect(newWallets.length).toEqual(3);
			expect(newWallets).toContainEqual(wallets[0]);
			expect(newWallets).toContainEqual(wallets[1]);
			await hasWalletData(wallets[0].id, true);
			hasTable('wallets_old', false);
		});
		it('wallet has conflict with same address but different id not overwritten', async () => {
			await TestDb.migrate('up', { to: prevMigration });

			await TestDb.knex('wallets').insert(testWallets);
			let wallets = await TestDb.knex('wallets').select();

			const oldWallets = testOldWallets.map((w, index) => ({
				...w,
				id: index + wallets.length + 1
			}));

			await createOldWallets();
			await TestDb.knex('wallets_old').insert(oldWallets[0]);

			await insertWalletData(oldWallets[0].id);

			await TestDb.migrate('up', { to: currMigration });
			await hasWalletData(oldWallets[0].id, false);
			let newWallets = await TestDb.knex('wallets').select();
			expect(newWallets.length).toEqual(2);
			expect(newWallets).toEqual(wallets);
			hasTable('wallets_old', false);
		});
		it('wallet has conflict with same address but different id overwritten', async () => {
			await TestDb.migrate('up', { to: prevMigration });

			await TestDb.knex('wallets').insert(testWallets);
			let wallets = await TestDb.knex('wallets').select();

			const oldWallet = {
				publicKey: wallets[0].address,
				createdAt: Date.now(),
				id: wallets[1].id
			};
			await createOldWallets();
			await TestDb.knex('wallets_old').insert(oldWallet);

			await insertWalletData(oldWallet.id);

			await TestDb.migrate('up', { to: currMigration });
			await hasWalletData(oldWallet.id, true);
			let newWallets = await TestDb.knex('wallets').select();
			expect(newWallets.length).toEqual(2);
			expect(newWallets).toEqual(wallets);
			hasTable('wallets_old', false);
		});
		it('wallet has conflict with same id but different address', async () => {
			await TestDb.migrate('up', { to: prevMigration });

			await TestDb.knex('wallets').insert(testWallets);
			let wallets = await TestDb.knex('wallets').select();

			const oldWallet = {
				publicKey: 'test4',
				createdAt: Date.now(),
				id: wallets[0].id
			};
			await createOldWallets();
			await TestDb.knex('wallets_old').insert(oldWallet);

			await TestDb.migrate('up', { to: currMigration });

			let newWallets = await TestDb.knex('wallets').select();
			let migratedWallet = (await TestDb.knex('wallets')
				.select()
				.where({ address: oldWallet.publicKey }))[0];

			expect(newWallets.length).toEqual(3);
			expect(migratedWallet.id).toBe(3);
			expect(migratedWallet.address).toBe('test4');
			const tokens = await TestDb.knex('wallet_tokens')
				.select()
				.where({ walletId: migratedWallet.id });
			expect(tokens.length).toBe(1);
			const identities = await TestDb.knex('identities')
				.select()
				.where({ walletId: migratedWallet.id });
			expect(identities.length).toBe(1);
			hasTable('wallets_old', false);
		});
	});
});
