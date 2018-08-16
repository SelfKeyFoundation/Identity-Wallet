import { db as config } from 'common/config';
import { Model } from 'objection';
import Knex from 'knex';

export class TestDb {
	async init() {
		this.knex = Knex(config);
		Model.knex(this.knex);
		await this.knex.migrate.latest();
		await this.knex.seed.run();
	}
	async reset() {
		if (this.knex) {
			await this.destroyPool();
		}
		await this.init();
	}
	destroyPool() {
		if (!this.knex) return Promise.resolve();
		return new Promise((resolve, reject) => this.knex.destroy(() => resolve()));
	}
}

export default TestDb;
