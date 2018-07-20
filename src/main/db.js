const { Logger } = require('common/logger');
const log = new Logger('db');
const { db } = require('./config');
const fs = require('fs');
const knex = require('knex')(db);
const { Model } = require('objection');
Model.knex(knex);

const init = async () => {
	try {
		await createInitialDb();
	} catch (e) {
		log.error(e);
		const backupPath = `${db.connection.filename}.bkp`;
		// Tear down connections connected to existing file
		await knex.destroy();
		try {
			createBackup(db.connection.filename, backupPath);
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
		await knex.client.initializePool(db);
		await createInitialDb();
	}
};

const createInitialDb = async () => {
	log.info('starting migration');
	await knex.migrate.latest();
	log.info('starting seeding');
	await knex.seed.run();
};

const createBackup = (dbPath, backupPath) => {
	backupPath = backupPath || `${dbPath}.bkp`;
	if (fs.existsSync(backupPath)) {
		throw new Error('Backup file exists');
	}
	fs.renameSync(dbPath, backupPath);
};

module.exports = {
	config: db,
	knex,
	init,
	createInitialDb
};
