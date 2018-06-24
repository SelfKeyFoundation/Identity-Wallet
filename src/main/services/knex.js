const fs = require('fs');

const knexFile = require('../knexfile.js');
const knex = require('knex')(knexFile);

const init = async () => {
	try {
		// Run migraitons
		await knex.migrate.latest();

		// Seed required data
		// No checks here, since they are handled in the seed file
		await knex.seed.run();
	} catch (e) {
		console.error(e);

		const backupPath = `${knexFile.connection.filename}.bkp`;

		if (fs.existsSync(backupPath)) {
			console.log('Automatic recovery has already been attempted and failed. Aborting.');
			throw e;
		}

		// Tear down connections connected to existing file
		await knex.destroy();

		fs.renameSync(knexFile.connection.filename, backupPath);

		console.log(
			`Attempting automatic recovery. Existing data file has been moved to ${backupPath}`
		);

		// Connect to new data file
		await knex.initialize(knexFile);

		// Try to initialize it.
		// This won't loop infinitely due to the check for the backup file.
		return init();
	}
};

module.exports = {
	knex,
	init
};
