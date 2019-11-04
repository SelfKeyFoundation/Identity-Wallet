import TestDb from '../db/test-db';
import { setupTestDb, hasColumn } from './migration-test-utils';

describe('migrations', () => {
	setupTestDb(jest);
	describe('up 20191030160702_members', () => {
		const currMigration = '20191030160702';
		const prevMigration = '20191014104425';
		const testIdentities = [
			{ id: 1, walletId: 1, type: 'individual', createdAt: Date.now() },
			{
				id: 2,
				walletId: 1,
				type: 'corporate',
				createdAt: Date.now()
			},
			{
				id: 3,
				walletId: 2,
				type: 'individual',
				createdAt: Date.now()
			}
		];
		it('has equity column', async () => {
			await TestDb.migrate('up', { to: prevMigration });
			await hasColumn('identities', 'equity', false);
			await TestDb.migrate('up', { to: currMigration });
			await hasColumn('identities', 'equity', true);
		});
		it('has positions column', async () => {
			await TestDb.migrate('up', { to: prevMigration });
			await hasColumn('identities', 'positions', false);
			await TestDb.migrate('up', { to: currMigration });
			await hasColumn('identities', 'positions', true);
		});
		it('identity equity attribute should be 0', async () => {
			await TestDb.migrate('up', { to: prevMigration });
			await TestDb.knex('identities').insert(testIdentities);
			await TestDb.migrate('up', { to: currMigration });
			let identities = await TestDb.knex('identities').select();
			identities.forEach(identity => expect(identity.equity).toBe(0));
		});
		it('identity positions attribute should be [""]', async () => {
			await TestDb.migrate('up', { to: prevMigration });
			await TestDb.knex('identities').insert(testIdentities);
			await TestDb.migrate('up', { to: currMigration });
			let identities = await TestDb.knex('identities').select();
			identities.forEach(identity => expect(identity.equity).toBe(0));
		});
	});
});
