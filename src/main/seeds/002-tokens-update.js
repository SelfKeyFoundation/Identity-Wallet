const ethTokens = require('../assets/data/eth-tokens.json');

exports.seed = async function(knex) {
	const seedHasRun = await knex('seed')
		.where('name', 'tokens-update')
		.count('name as countName');
	if (seedHasRun[0].countName > 0) {
		return;
	}
	const tokens = await knex('tokens');
	console.log();
	const tokensMap = tokens.reduce((acc, curr) => {
		acc[curr.address.toLowerCase()] = curr;
		return acc;
	}, {});

	const toInsert = ethTokens.filter(t => !tokensMap[t.address.toLowerCase()]);

	await knex('tokens').update({ address: knex.raw('LOWER(??)', ['address']) });

	await Promise.all(
		toInsert.map(t =>
			knex('tokens').insert({ ...t, address: t.address.toLowerCase(), createdAt: Date.now() })
		)
	);

	await knex('seed').insert({ name: 'tokens-update' });
};
