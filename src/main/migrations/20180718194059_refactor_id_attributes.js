const transformAttrs = (acc, attr) => {
	const walletId = attr.walletId;
	let itm = {
		walletId,
		type: attr.idAttributeType,
		createdAt: attr.createdAt,
		updatedAt: attr.updatedAt
	};
	let items = JSON.parse(attr.items);

	if (!items || !items.length) {
		acc.push({ itm, children: [] });
		return acc;
	}

	for (let i = 0; i < items.length; i++) {
		let child = items[i];
		let attr = {
			...itm,
			isVerified: child.isVerified,
			createdAt: child.createdAt,
			updatedAt: child.updatedAt
		};
		if (!child.values || !child.values.length) {
			acc.push({ itm: attr, children: [] });
			continue;
		}
		if (child.values.length === 1) {
			let val = child.values[0];
			if (val.documentId) {
				attr.documentId = val.documentId;
				attr.updatedAt = val.updatedAt;
				attr.createdAt = val.createdAt;
				acc.push({ itm: attr, children: [] });
				continue;
			}
			let data = Object.keys(val.staticData || {}).map(key => {
				return { role: key, value: val.staticData[key] };
			});
			if (data.length === 1) {
				attr.value = data[0].val;
				attr.name = attr.name || data[0].role;
				attr.updatedAt = val.updatedAt;
				attr.createdAt = val.createdAt;
				acc.push({ itm: attr, children: [] });
				continue;
			}
		}
		let children = [];
		for (let j = 0; j < child.values; j++) {
			let val = child.values[j];
			if (val.documentId) {
				children.push({
					walletId,
					documentId: val.documentId,
					createdAt: val.createdAt,
					updatedAt: val.updatedAt
				});
				continue;
			}
			let data = Object.keys(val.staticData || {}).map(key => {
				return {
					walletId,
					role: key,
					value: val.staticData[key],
					createdAt: val.createdAt,
					updatedAt: val.updatedAt
				};
			});
			children = children.concat(data);
		}
		acc.push({ itm: attr, children });
	}
	return acc;
};

// id: genRandId(),
// 				name: null,
// 				isVerified: 0,
// 				order: 0,
// 				createdAt: Date.now(),
// 				updatedAt: null,
// 				values: [
// 					{
// 						id: genRandId(),
// 						staticData: {
// 							line1: initialIdAttributes[idAttributeType.key]
// 						},
// 						documentId: null,
// 						order: 0,
// 						createdAt: Date.now(),
// 						updatedAt: null
// 					}
// 				]

exports.up = async (knex, Promise) => {
	await knex.schema.renameTable('id_attributes', 'id_attributes_old');
	await knex.schema.createTable('id_attributes', table => {
		table.increments('id');
		table
			.integer('walletId')
			.notNullable()
			.references('wallets.id');
		table.string('type').references('id_attribute_types.key');
		table.string('name');
		table.string('value');
		table.integer('isVerified').defaultTo(0);
		table.integer('documentId').references('documentId');
		table.integer('createdAt').notNullable();
		table.integer('updatedAt');
	});
	await knex.schema.createTable('id_attributes_connect', table => {
		table.integer('parentId').references('id_attributes.id');
		table.integer('order').defaultTo(0);
		table.string('role');
		table.integer('childId').references('id_attributes.id');
	});
	let attributes = await knex('id_attributes_old')
		.query()
		.reduce(transformAttrs, []);
	await knex('id_attributes').insertGraph(attributes);
	await knex.schema.dropTable('id_attributes_old');
};

exports.down = async (knex, Promise) => {};
