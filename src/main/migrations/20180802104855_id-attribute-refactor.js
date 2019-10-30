/* istanbul ignore file */
exports.up = async (knex, Promise) => {
	try {
		await knex.schema.renameTable('id_attributes', 'id_attributes_old');
		await knex.schema.createTable('id_attributes', table => {
			table.increments('id');
			table
				.integer('walletId')
				.notNullable()
				.references('wallets.id');
			table
				.integer('type')
				.notNullable()
				.references('id_attribute_types.key');
			table
				.text('data')
				.notNullable()
				.defaultTo('{}');
			table.integer('documentId').references('documents.id');
			table.integer('createdAt').notNullable();
			table.integer('updatedAt');
		});

		let attributes = await knex('id_attributes_old').select();

		attributes = attributes
			.map(attr => {
				const items = JSON.parse(attr.items);
				const type = attr.idAttributeType;
				let documentId = null;
				let oldVal = null;
				let data = null;

				if (items.length && items[0].values.length) {
					oldVal = items[0].values[0];
				}

				if (oldVal && oldVal.documentId) {
					documentId = oldVal.documentId;
				}

				if (oldVal && oldVal.staticData && oldVal.staticData) {
					data = oldVal.staticData;
				}

				let newAttr = {
					id: attr.id,
					createdAt: attr.createdAt,
					updatedAt: attr.updatedAt,
					walletId: attr.walletId,
					type,
					documentId,
					data: data && data.line1 ? { value: data.line1 } : {}
				};

				switch (type) {
					case 'physical_address':
					case 'work_place':
						newAttr.data = {
							address: data.line1,
							address2: data.line2,
							city: data.line3,
							region: data.line4,
							zip: data.line5,
							country: data.line6
						};
						break;
					case 'phonenumber_countrycode':
						newAttr.data = {
							countryCode: data.line1,
							telephoneNumber: data.line2
						};
						break;
				}
				newAttr.data = JSON.stringify(newAttr.data);
				return newAttr;
			})
			.map(attr => knex('id_attributes').insert(attr));

		await Promise.all(attributes);
		await knex.schema.dropTable('id_attributes_old');
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.down = async (knex, Promise) => {};
