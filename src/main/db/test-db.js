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
		await this.init();
	}
}

export default TestDb;
