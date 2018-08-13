import db from './db';

let initialized = false;

const init = async () => {
	initialized = true;
	await db.createInitialDb();
};

const ensureConnection = async () => {
	try {
		await db.knex.raw('select 1+1 as result');
		return false;
	} catch (err) {
		await db.knex.client.initializePool(db.config);
		return true;
	}
};

const reset = async () => {
	let isNewConn = await ensureConnection();
	if (!isNewConn) {
		await db.reset();
	}
	await init();
};

export { init, reset };

export default {
	init,
	reset
};
