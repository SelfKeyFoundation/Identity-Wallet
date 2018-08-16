import { db as config } from 'common/config';
import { Model } from 'objection';
import Knex from 'knex';

export class TestDb {
	constructor() {
		this.initKnex();
	}
	initKnex() {
		this.knex = Knex(config);
		Model.knex(this.knex);
	}
	async init() {
		await this.aquireConnection();
		await this.knex.migrate.latest();
		await this.knex.seed.run();
	}
	async aquireConnection(attempt = 0) {
		try {
			await this.knex.raw('select 1+1 as result');
		} catch (error) {
			if (attempt === 3) {
				console.error('Could not establish connection', 3, 'times', error);
				throw error;
			}
			this.initKnex();
			return this.aquireConnection(attempt + 1);
		}
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
	async destroy() {
		await this.destroyPool();
	}
}

export default TestDb;
