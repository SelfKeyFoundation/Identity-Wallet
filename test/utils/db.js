const db = require('../../src/main/db');

const init = async () => {
	await db.createInitialDb();
};

const reconnect = async () => {
	await db.knex.destroy();
	await db.knex.client.initializePool(db.config);
};

const reset = async () => {
	await reconnect();
	await init();
};

module.exports = {
	init,
	reset
};
