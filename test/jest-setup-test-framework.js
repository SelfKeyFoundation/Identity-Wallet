let config = require('../src/common/config');
let { Model } = require('objection');
let Knex = require('knex');
let knex;
process.on('unhandledRejection', error => {
	// Will print "unhandledRejection err is not defined"
	console.log('unhandledRejection', error);
});

beforeAll(async () => {
	knex = Knex(config.db);
	await knex.raw('select 1+1 as result');
	await knex.migrate.latest();
	await knex.seed.run();
	Model.knex(knex);
});

afterAll(async () => {
	await knex.destroy();
	Model.knex(null);
});
