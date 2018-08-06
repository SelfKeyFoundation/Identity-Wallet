import { Logger } from 'common/logger';
import fs from 'fs';
import { Model } from 'objection';
import { db as config } from 'common/config';
import Knex from 'knex';
const log = new Logger('db');
const knex = Knex(config);
Model.knex(knex);

const init = async () => {
	try {
		await createInitialDb();
	} catch (e) {
		log.error(e);
		const backupPath = `${config.connection.filename}.bkp`;
		// Tear down connections connected to existing file
		await knex.destroy();
		try {
			createBackup(config.connection.filename, backupPath);
		} catch (backupError) {
			log.error(
				'Automatic recovery has already been attempted and failed. Aborting. %s',
				backupError
			);
			throw e;
		}

		log.info(
			`Attempting automatic recovery. Existing data file has been moved to ${backupPath}`
		);
		// Should use knex.initialize in knex v > 0.15.0
		await knex.client.initializePool(config);
		await createInitialDb();
	}
};

const createInitialDb = async () => {
	await knex.migrate.latest();
	await knex.seed.run();
};

const createBackup = (dbPath, backupPath) => {
	backupPath = backupPath || `${dbPath}.bkp`;
	if (fs.existsSync(backupPath)) {
		throw new Error('Backup file exists');
	}
	fs.renameSync(dbPath, backupPath);
};

export { config, knex, init, createInitialDb };
export default { config, knex, init, createInitialDb };
