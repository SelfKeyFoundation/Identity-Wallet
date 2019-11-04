/* istanbul ignore file */
import knexMigrate from 'knex-migrate';
import fs from 'fs';
import { Model } from 'objection';
import Knex from 'knex';
import { db as config } from 'common/config';

const DEBUG_MIGRATIONS = process.env.DEBUG_MIGRATIONS;

export class TestDb {
	static config = config;
	static lock = false;
	static locks = [];
	static async init() {
		try {
			await this.initRaw();
			await this.knex.migrate.latest();
			await this.knex.seed.run();
		} catch (error) {
			console.log(error);
		}
	}
	static async initRaw(dbName, lock) {
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

	static async waitForLock(lock = true) {
		if (this.lock) {
			let lockPromise = new Promise();
			this.locks.push(lockPromise);
			await lockPromise;
		}
		this.lock = lock;
	}

	static migrate(cmd, flags = {}) {
		const log = ({ action, migration }) => console.log('Doing ' + action + ' on ' + migration);
		if (!flags.config) {
			flags.config = this.config;
		}
		if (DEBUG_MIGRATIONS) {
			flags.debug = DEBUG_MIGRATIONS;
			flags.verbose = DEBUG_MIGRATIONS;
		}
		return knexMigrate(cmd, flags, DEBUG_MIGRATIONS ? log : null);
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
				await fs.promises.unlink(this.config.connection);
			}
		} catch (error) {
			if (this.config.connection !== ':memory:') {
				await fs.promises.unlink(this.config.connection);
			}
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
			this.lock = false;
			if (this.locks.length > 0) {
				let promise = this.locks.unshift();
				promise.resolve();
			}
		} catch (error) {
			console.log(error);
		}
	}
}

export default TestDb;
