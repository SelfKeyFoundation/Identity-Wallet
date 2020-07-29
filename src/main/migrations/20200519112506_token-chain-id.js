/* istanbul ignore file */
const allTokens = require('../assets/data/eth-tokens.json');
const chain3Tokens = allTokens.filter(t => t.chainId === 3).map(t => t.address);

exports.up = async (knex, Promise) => {
	await knex.schema.alterTable('tokens', t => {
		t.integer('networkId').defaultTo(1);
		t.string('type').defaultTo('erc-20');
	});
	const tokens = await knex('tokens').whereIn('address', chain3Tokens);
	await Promise.all(
		tokens.map(async t => {
			await knex('tokens')
				.update({ ...t, chainId: 3 })
				.where({ id: t.id });
		})
	);
};

exports.down = async (knex, Promise) => {};
