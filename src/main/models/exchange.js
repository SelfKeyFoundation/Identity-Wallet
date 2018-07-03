const { knex, sqlUtil } = require('../../services/knex');

const TABLE_NAME = 'exchange_data';

module.exports = {
	TABLE_NAME,

	create: async (data, tx) => sqlUtil.insert(TABLE_NAME, data, tx),

	import: async exchangeData => {
		const existing = (await sqlUtil.select(TABLE_NAME, 'name')).reduce((lookup, row) => {
			lookup[row.name] = true;
			return lookup;
		}, {});

		const inserts = [];
		const updates = [];

		exchangeData.forEach(row => {
			if (existing[row.name]) {
				updates.push(row);
				return;
			}

			inserts.push(row);
		});

		await sqlUtil.bulkAdd(TABLE_NAME, inserts);
		await sqlUtil.bulkUpdate(TABLE_NAME, updates, ({ name }) => ({ name }));
	},

	findAll: async tx =>
		((await sqlUtil.select(TABLE_NAME, '*', null, tx)) || []).map(e => ({
			name: e.name,
			data: JSON.parse(e.data)
		}))
};
