import { db as config } from 'common/config';
import { Model } from 'objection';
import Knex from 'knex';

export class TestDb {
	static async init() {
		try {
			this.knex = Knex(config);
			this.oldKnex = Model.knex();
			Model.knex(this.knex);
			await this.aquireConnection();
			await this.knex.migrate.latest();
			await this.knex.seed.run();
		} catch (error) {
			console.log(error);
		}
	}
	static async aquireConnection(attempt = 0) {
		try {
			await this.knex.raw('select 1+1 as result');
		} catch (error) {
			if (attempt === 3) {
				console.error('Could not establish connection', 3, 'times', error);
				throw error;
			}
			return this.aquireConnection(attempt + 1);
		}
	}
	static async reset() {
		try {
			await this.knex.destroy();
			Model.knex(this.oldKnex);
		} catch (error) {
			console.log(error);
		}
	}
	static async destroyAllTables() {
		if (!this.knex) throw new Error('no-connectikon');
		let tables = await this.knex('sqlite_master').where('type', 'table');
		await Promise.all(
			tables
				.filter(t => !['sqlite_master', 'sqlite_sequence'].includes(t.name))
				.map(t => this.knex.schema.dropTable(t.name))
		);
	}
	static async destroy() {
		try {
			await this.knex.destroy();
			this.knex = null;
		} catch (error) {
			console.log(error);
		}
	}
}

export default TestDb;
