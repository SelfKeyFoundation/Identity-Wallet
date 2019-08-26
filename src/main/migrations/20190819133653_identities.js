/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	await knex.schema.createTable('identities', t => {
		t.increments('id');
		t.integer('walletId');
		t.integer('parentId');
		t.boolean('rootIdentity');
		t.binary('profilePicture');
		t.string('type');
		t.string('name');
		t.integer('did');
		t.boolean('isSetupFinished').defaultTo(false);
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});
	await knex.schema.renameTable('wallets', 'wallets_old');
	await knex.schema.createTable('wallets', t => {
		t.increments('id');
		t.string('name');
		t.string('address')
			.unique()
			.notNullable();
		t.string('keystoreFilePath');
		t.string('type')
			.notNullable()
			.defaultTo('local');
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});

	let walletsOld = await knex('wallets_old').select();

	let { wallets, identities } = walletsOld.reduce(
		(acc, curr) => {
			acc.wallets.push({
				id: curr.id,
				name: curr.name,
				address: curr.publicKey,
				keystoreFilePath: curr.keystoreFilePath,
				type: curr.profile,
				createdAt: curr.createdAt,
				updatedAt: Date.now()
			});
			acc.identities.push({
				name: curr.name,
				walletId: curr.id,
				parentId: null,
				rootIdentity: true,
				profilePicture: curr.profilePicture,
				type: 'individual',
				did: curr.did,
				isSetupFinished: !!curr.isSetupFinished,
				createdAt: Date.now(),
				updatedAt: Date.now()
			});
			return acc;
		},
		{ wallets: [], identities: [] }
	);

	await knex('wallets').insert(wallets);
	await knex('identities').insert(identities);

	await knex.schema.renameTable('id_attributes', 'id_attributes_old');

	let attributesOld = await knex('id_attributes_old').select();

	await knex.schema.createTable('id_attributes', t => {
		t.increments('id');
		t.integer('identityId')
			.notNullable()
			.references('identities.id');
		t.string('name');
		t.integer('typeId')
			.notNullable()
			.references('id_attribute_types.id');
		t.text('data')
			.notNullable()
			.defaultTo('{}');
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});

	identities = await knex('identities').select();

	let walletIdentities = identities.reduce((acc, curr) => {
		acc[curr.walletId] = curr.id;
		return acc;
	}, {});

	const attributes = attributesOld.map(attr => ({
		id: attr.id,
		identityId: walletIdentities[attr.walletId],
		name: attr.name,
		typeId: attr.typeId,
		data: attr.data,
		createdAt: attr.createdAt,
		updatedAt: Date.now()
	}));
	await knex('id_attributes').insert(attributes);
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('identities');
};
