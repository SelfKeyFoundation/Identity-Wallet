const { knex } = require('../../services/knex');

const TABLE_NAME = 'exchange_data';

module.exports = () => ({
	create: async data => knex(TABLE_NAME).insert(data),

	import: async exchangeData => {
		const existing = (await knex(TABLE_NAME).select('name')).reduce(
			(lookup, row) =>
				Object.assign(lookup, {
					[row.name]: true
				}),
			{}
		);

		const inserts = [];
		const updates = [];

		exchangeData.forEach(row => {
			if (existing[row.name]) {
				updates.push(row);
				return;
			}

			inserts.push(row);
		});

		await knex.batchInsert(TABLE_NAME, inserts);
		await Promise.all(
			updates.map(update =>
				knex(TABLE_NAME)
					.where({ name: update.name })
					.update({ data: update.data })
			)
		);
	},

	findAll: () =>
		knex(TABLE_NAME)
			.select()
			.then(rows => (rows || []).map(e => ({ name: e.name, data: JSON.parse(e.data) })))
});
