/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.createTable('identities', t => {
			t.increments('id');
			t.integer('walletId');
			t.integer('parentId');
			t.boolean('rootIdentity');
			t.binary('profilePicture');
			t.string('type');
			t.string('name');
			t.string('did');
			t.boolean('isSetupFinished').defaultTo(false);
			t.integer('createdAt').notNullable();
			t.integer('updatedAt');
		});

		let walletsOld = await knex('wallets').select();

		let identities = walletsOld.reduce((acc, curr) => {
			acc.push({
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
		}, []);
		await knex.schema.renameTable('id_attributes', 'id_attributes_old');
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

		if (!identities.length) {
			return;
		}
		await knex('identities').insert(identities);

		let attributesOld = await knex('id_attributes_old').select();

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

		await knex.schema.dropTable('id_attributes_old');

		await knex.schema.table('orders', t => {
			t.string('identityId');
		});

		for (let wallet of walletsOld) {
			await knex('orders')
				.where({ walletId: wallet.id })
				.update({ identityId: walletIdentities[wallet.id] });
		}
	} catch (error) {
		console.error(error.stack);
		throw error;
	}
};

exports.down = async (knex, Promise) => {
	await knex.schema.dropTable('identities');
};
