const db = require('../../src/main/db');
const dbManager = require('knex-db-manager').databaseManagerFactory({ knex: db.config });

const init = async () => {
	await db.createInitialDb();
};

const reset = async () => {
	await dbManager.truncateDB();
	await db.knex.seed.run();
};

module.exports = {
	init,
	reset
};
