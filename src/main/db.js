const { db } = require('./config');
const fs = require('fs');
const knex = require('knex')(db);
const { Model } = require('objection');
Model.knex(knex);

const init = async () => {
	try {
		await createInitialDb();
	} catch (e) {
		console.error(e);
		// Tear down connections connected to existing file
		await knex.destroy();

		try {
			createBackup(db.connection.filename);
		} catch (backupError) {
			console.log('Automatic recovery has already been attempted and failed. Aborting.');
			throw e;
		}

		console.log(
			`Attempting automatic recovery. Existing data file has been moved to ${backupPath}`
		);

		await knex.initialize(db);
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

module.exports = {
	config: db,
	knex,
	init,
	createInitialDb
};
