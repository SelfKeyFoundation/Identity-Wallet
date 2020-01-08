import TestDb from '../db/test-db';
import { setupTestDb } from './migration-test-utils';

describe('all-migrations', () => {
	setupTestDb(jest);

	it('should migrate successfully on all migrations', async () => {
		const pendingMigrations = await TestDb.migrate('pending');

		for (let migration of pendingMigrations) {
			let success = true;
			let number = migration.match(/[/,\\]([0-9]+)/)[1];
			try {
				if (!number) throw new Error('Invalid migration');
				await TestDb.migrate('up', {
					to: number
				});
			} catch (error) {
				console.error('Error in migration', migration, error);
				success = false;
			}
			expect(success).toBe(true);
		}
	});
});
