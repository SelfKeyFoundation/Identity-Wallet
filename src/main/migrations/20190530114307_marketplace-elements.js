exports.up = async knex => {
	try {
		await knex.schema.createTable('vendors', t => {
			t.increments('id');
			t.string('env');
			t.string('vendorId').notNullable();
			t.string('name');
			t.string('description');
			t.string('status');
			t.string('categories');
			t.string('inventorySource').defaultTo('selfkey');
			t.string('relyingPartyConfig').defaultTo('{}');
			t.string('privacyPolicy');
			t.string('termsOfService');
			t.string('contactEmail');
			t.string('did');
			t.string('paymentAddress');
			t.integer('createdAt')
				.notNullable()
				.defaultTo(Date.now());
			t.integer('updatedAt');
			t.unique(['vendorId', 'env']);
		});
		await knex.schema.createTable('inventory', t => {
			t.increments('id');
			t.string('sku').notNullable();
			t.string('env');
			t.string('vendorId').notNullable();
			t.string('name');
			t.string('description');
			t.string('status');
			t.string('parentSku');
			t.string('category');
			t.string('price');
			t.string('priceCurrency').defaultTo('USD');
			t.string('data').defaultTo('{}');
			t.integer('createdAt')
				.notNullable()
				.defaultTo(Date.now());
			t.integer('updatedAt');
			t.unique(['sku', 'vendorId', 'env']);
		});
		await knex.schema.createTable('marketplace_country', t => {
			t.increments('id');
			t.string('code').notNullable();
			t.string('env');
			t.string('name');
			t.string('currencyCode');
			t.integer('population');
			t.string('fipsCode');
			t.string('isoNumeric');
			t.string('north');
			t.string('south');
			t.string('east');
			t.string('west');
			t.string('capital');
			t.string('continentName');
			t.string('continent');
			t.string('areaInSqKm');
			t.string('languages').defaultTo('[]');
			t.string('isoAlpha3');
			t.string('geonameId');
			t.integer('createdAt')
				.notNullable()
				.defaultTo(Date.now());
			t.integer('updatedAt');
			t.unique(['code', 'env']);
		});
		await knex.schema.createTable('tax_treaties', t => {
			t.increments('id');
			t.string('countryCode').notNullable();
			t.string('env');
			t.string('jurisdictionCountryCode');
			t.string('currencyCode');
			t.string('jurisdiction');
			t.string('isoNumeric');
			t.string('typeEOI');
			t.string('dateSigned');
			t.string('dateActive');
			t.string('meetsStandards');
			t.string('containsParas4and5');
			t.string('pdfUrl');
			t.integer('createdAt')
				.notNullable()
				.defaultTo(Date.now());
			t.integer('updatedAt');
			t.unique(['countryCode', 'jurisdictionCountryCode']);
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async knex => {
	await knex.schema.dropTable('vendors');
	await knex.schema.dropTable('inventory');
	await knex.schema.dropTable('marketplace_country');
	await knex.schema.dropTable('tax_treaties');
};
