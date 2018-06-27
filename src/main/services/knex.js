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

		return query.insert(args);
	},

	insertAndSelect: (table, data, trx) => {
		return new Promise((resolve, reject) => {
			let promise = null;

			if (!trx) {
				promise = knex(table).insert(data);
			} else {
				promise = knex(table)
					.transacting(trx)
					.insert(data);
			}

			return promise
				.then(resp => {
					if (!resp || resp.length !== 1) {
						return reject({ message: 'error_while_creating' });
					}

					let selectPromise = null;

					if (trx) {
						selectPromise = knex(table)
							.transacting(trx)
							.select()
							.where('id', resp[0]);
					} else {
						selectPromise = knex(table)
							.select()
							.where('id', resp[0]);
					}

					return selectPromise
						.then(rows => {
							if (rows && rows.length === 1) {
								return resolve(rows[0]);
							} else {
								return reject({ message: 'error_while_creating' });
							}
						})
						.catch(error => {
							return reject({ message: 'error_while_creating', error: error });
						});
				})
				.catch(error => {
					return reject({ message: 'error_while_creating', error: error });
				});
		});
	},

	update: (table, item, where, tx) => {
		let query = knex(table);

		if (tx) {
			query = query.transacting(tx);
		}

		if (where) {
			query = query.where(where);
		}

		return query.update(item);
	},

	insertIntoTable: (table, data, trx) => {
		return new Promise((resolve, reject) => {
			let promise = null;
			if (!trx) {
				promise = knex(table).insert(data);
			} else {
				promise = knex(table)
					.transacting(trx)
					.insert(data);
			}

			return promise
				.then(resp => {
					if (!resp || resp.length !== 1) {
						return reject({ message: 'error_while_creating' });
					}

					let selectPromise = null;

					if (trx) {
						selectPromise = knex(table)
							.transacting(trx)
							.select()
							.where('id', resp[0]);
					} else {
						selectPromise = knex(table)
							.select()
							.where('id', resp[0]);
					}

					return selectPromise
						.then(rows => {
							if (rows && rows.length === 1) {
								return resolve(rows[0]);
							} else {
								return reject({ message: 'error_while_creating' });
							}
						})
						.catch(error => {
							return reject({ message: 'error_while_creating', error: error });
						});
				})
				.catch(error => {
					return reject({ message: 'error_while_creating', error: error });
				});
		});
	},

	updateById: async (table, data) => {
		data.updatedAt = new Date().getTime();

		const updatedIds = await knex(table)
			.update(data)
			.where({ id: data.id });

		if (!updatedIds || updatedIds != 1) {
			throw new Error('error_while_updating');
		}

		const rows = await knex(table)
			.select()
			.where({ id: data.id });

		if (rows && rows.length == 1) {
			return rows[0];
		} else {
			throw new Error('error_while_updating');
		}
	},

	selectById: (table, id) => {
		return new Promise((resolve, reject) => {
			return knex(table)
				.select()
				.where('id', id)
				.then(rows => {
					rows && rows.length ? resolve(rows[0]) : resolve(null);
				})
				.catch(error => {
					return reject({ message: 'error_while_selecting', error: error });
				});
		});
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
		console.log(query);
		return query;
	},

	bulkUpdateById: (table, records) => {
		return sqlUtil.getBulk(table, records, sqlUtil.getUpdateQuery);
	},

	bulkAdd: (table, records) => {
		return sqlUtil.getBulk(table, records, sqlUtil.getInsertQuery);
	},

	getBulk: (table, records, queryFunction) => {
		return knex.transaction(trx => {
			const queries = [];
			records.forEach(record => {
				const query = queryFunction(table, record, trx);
				queries.push(query);
			});

			Promise.all(queries)
				.then(trx.commit)
				.catch(trx.rollback);
		});
	},

	getInsertQuery: (table, record, trx) => {
		const now = new Date().getTime();
		record.createdAt = now;
		record.updatedAt = now;
		return knex(table)
			.insert(record)
			.transacting(trx);
	},

	getUpdateQuery: (table, record, trx) => {
		record.updatedAt = new Date().getTime();
		return knex(table)
			.where({ id: record.id })
			.update(record)
			.transacting(trx);
	}
};

module.exports = {
	knex,
	init,
	sqlUtil
};
