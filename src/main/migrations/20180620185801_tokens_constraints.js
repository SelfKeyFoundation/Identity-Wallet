/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.table('tokens', function(t) {
			t.dropUnique('symbol');
			t.unique('address');
		});
		await knex('tokens')
			.update('symbol', 'ETHOS')
			.where({
				address: '0x5Af2Be193a6ABCa9c8817001F45744777Db30756'
			});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.table('tokens', function(t) {
		t.dropUnique('address');
		t.unique('symbol');
	});
};
