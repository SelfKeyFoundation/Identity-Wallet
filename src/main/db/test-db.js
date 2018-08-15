import { db as config } from 'common/config';
import db from './db';
import { Model } from 'objection';
import Knex from 'knex';

export class TestDb {
	async init() {
		this.knex = Knex(db.config);
		Model.knex(this.knex);
		await this.knex.migrate.latest();
		await this.knex.seed.run();
	}
	async reset() {
		// try {
		// 	await this.rollbackAll();
		// } catch (error) {
		// 	console.error('rollback failed', error);
		// }
		await this.init();
	}

	async rollbackAll() {
		await this.knex.migrate.forceFreeMigrationsLock();
		let migration = await this.knex.migrate.currentVersion(config.migrations);
		if (migration === 'none') return;
		await this.knex.migrate.rollback(config.migrations);
		return this.rollbackAll();
	}
}

export default TestDb;
