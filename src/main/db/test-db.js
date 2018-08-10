import db from './db';

let initialized = false;

const init = async () => {
	initialized = true;
	await db.createInitialDb();
};

const reset = async () => {
	if (initialized) await db.reset();
	await init();
};

export { init, reset };

export default {
	init,
	reset
};
