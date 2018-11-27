/* istanbul ignore file */
import knexMigrate from 'knex-migrate';
import fs from 'fs';
import { db as config } from 'common/config';
import { Model } from 'objection';
import Knex from 'knex';

export class TestDb {
	static config = config;
	static async init() {
		try {
			await this.initRaw();
			await this.knex.migrate.latest();
			await this.knex.seed.run();
		} catch (error) {
			console.log(error);
		}
	}
	static async initRaw(dbName) {
		try {
			if (dbName) {
				this.config.connection = dbName;
			}
			this.knex = Knex(config);
			Model.knex(this.knex);
			await this.aquireConnection();
		} catch (error) {
			console.log(error);
		}
	}

	static migrate(cmd, flags = {}) {
		if (!flags.config) {
			flags.config = this.config;
		}
		return knexMigrate(cmd, flags);
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
			if (this.config.connection !== ':memory:') {
				fs.unlinkSync(this.config.connection);
			}
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
