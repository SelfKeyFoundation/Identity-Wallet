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

const sqlUtil = {
	insert: (table, args, tx) => {
		let query = knex(table);

		if (tx) {
			query = query.transacting(tx);
		}

		const ts = Date.now();
		args = { ...args, createdAt: ts, updatedAt: ts };

		return query.insert(args);
	},

	insertAndSelect: async (table, data, trx) => {
		let insertResp, selectResp;
		try {
			insertResp = await sqlUtil.insert(table, data, trx);
		} catch (error) {
			throw { message: 'error_while_creating', error: error };
		}

		if (!insertResp || insertResp.length !== 1) {
			throw { message: 'error_while_creating' };
		}

		try {
			selectResp = await sqlUtil.select(table, '*', { id: insertResp[0] }, trx);
		} catch (error) {
			throw { message: 'error_while_creating', error: error };
		}

		if (!selectResp && selectResp.length !== 1) {
			throw { message: 'error_while_creating' };
		}

		return selectResp[0];
	},

	update: (table, item, where, tx) => {
		let query = knex(table);
		item = { ...item, updatedAt: Date.now() };
		if (tx) {
			query = query.transacting(tx);
		}

		if (where) {
			query = query.where(where);
		}

		return query.update(item);
	},

	updateById: async (table, id, data, tx) => {
		const affectedRows = await sqlUtil.update(table, data, { id }, tx);

		if (!affectedRows) {
			throw new Error('error_while_updating');
		}

		const rows = await sqlUtil.select(table, '*', { id }, tx);

		if (!rows || rows.length !== 1) {
			throw new Error('error_while_updating');
		}

		return rows[0];
	},

	select: (table, select, where, tx) => {
		let query = knex(table);

		if (tx) {
			query = query.transacting(tx);
		}

		query = query.select(select);

		if (where) {
			query = query.where(where);
		}
		return query;
	},

	selectOne: async (table, select, where, tx) => {
		try {
			let rows = await sqlUtil.select(table, select, where, tx);
			if (!rows || !rows.length) {
				return null;
			}
			return rows[0];
		} catch (error) {
			throw { message: 'error_while_selecting', error: error };
		}
	},

	selectOneById: async (table, select, id, tx) => sqlUtil.selectOne(table, select, { id }, tx),

	bulkUpdate: (table, records, whereFn) =>
		sqlUtil.bulkQuery(table, records, (table, record, trx) =>
			sqlUtil.update(table, record, whereFn(record), trx)
		),

	bulkUpdateById: (table, records) => sqlUtil.bulkUpdate(table, records, ({ id }) => ({ id })),

	bulkAdd: (table, records) => sqlUtil.bulkQuery(table, records, sqlUtil.insert),

	bulkQuery: (table, records, queryFunction) =>
		knex.transaction(async trx => {
			const queries = records.map(record => queryFunction(table, record, trx));
			try {
				let res = await Promise.all(queries);
				return trx.commit(res);
			} catch (error) {
				return trx.rollback(error);
			}
		})
};

module.exports = {
	knex,
	init,
	sqlUtil
};
