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
		try {
			if (this.knex) {
				await this.destroyAllTables();
			}
			await this.init();
		} catch (error) {
			this.initKnex();
		}
	}
	async destroyAllTables() {
		if (!this.knex) throw new Error('no-connectikon');
		let tables = await this.knex('sqlite_master').where('type', 'table');
		await Promise.all(
			tables
				.filter(t => !['sqlite_master', 'sqlite_sequence'].includes(t.name))
				.map(t => this.knex.schema.dropTable(t.name))
		);
	}
	async destroy() {
		await this.destroyAllTables();
	}
}

export default TestDb;
