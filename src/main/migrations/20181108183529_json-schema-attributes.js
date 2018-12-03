/* istanbul ignore file */

const selfkeyPlatform = require('../assets/data/selfkey-platform.json');

const getAttribute = url => {
	let found = selfkeyPlatform.attributes.filter(attr => attr.$id === url);
	return found[0] || null;
};

const populateInitialRepo = async (ctx, knex, Promise) => {
	let repoIDs = await knex('repository').insert({
		url: 'https://platform.selfkey.org/repository.json',
		name: 'Selfkey.org',
		eager: true,
		content: '{}',
		expires: 0,
		createdAt: ctx.now,
		updatedAt: ctx.now
	});
	ctx.repoId = repoIDs[0];
	return ctx;
};

const attributeUrlForKey = key => {
	return `https://platform.selfkey.org/schema/attribute/${key.replace(/_/g, '-')}.json`;
};

const migrateAttributeTypes = async (ctx, knex, Promise) => {
	await knex.schema.renameTable('id_attribute_types', 'id_attribute_types_old');
	await knex.schema.createTable('id_attribute_types', t => {
		t.increments('id');
		t.string('url').notNullable();
		t.integer('defaultRepositoryId').references('repository.id');
		t.string('content').defaultTo('{}');
		t.integer('expires');
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});
	await knex.schema.createTable('repository_attribute_types', table => {
		table
			.integer('repositoryId')
			.notNullable()
			.references('repository.id');
		table
			.integer('attributeTypeId')
			.notNullable()
			.references('id_attribute_types.id');
	});

	let attributeTypes = await knex('id_attribute_types_old').select();
	let oldNewMap = {
		phonenumber_countrycode: {
			id: 'phone-number'
		}
	};
	let duplicateMap = {
		work_place: {
			id: 'physical_address'
		}
	};
	// TODO: go over all attribute types and hadnle cases when attribute key of old does not match json file of new
	// TODO: handle attribute merges
	ctx.attributeTypes = attributeTypes
		.map(t => {
			let oldKey = t.key;
			let duplicate = false;
			if (duplicateMap[t.key]) {
				duplicate = duplicateMap[t.key].id;
			}
			let key = oldNewMap[duplicate || t.key]
				? oldNewMap[duplicate || t.key].id
				: duplicate || t.key;
			let url = attributeUrlForKey(key);

			let attr = getAttribute(url);

			let newType = {
				oldKey,
				duplicate,
				type: {
					id: t.id,
					defaultRepositoryId: ctx.repoId,
					url,
					content: attr ? JSON.stringify(attr) : null,
					expires: ctx.now,
					createdAt: t.createdAt,
					updatedAt: ctx.now
				}
			};
			return newType;
		})
		.map(async t => {
			await knex('id_attribute_types').insert(t.type);
			return t;
		});
	ctx.attributeTypes = await Promise.all(ctx.attributeTypes);
	let attrsMap = ctx.attributeTypes.filter(t => !t.duplicate).reduce((acc, curr) => {
		acc[curr.oldKey] = curr;
		return acc;
	}, {});
	await Promise.all(
		ctx.attributeTypes.filter(t => !!t.duplicate).map(async t => {
			let newT = attrsMap[t.duplicate];
			if (!newT) return;

			await knex('id_attributes')
				.update({ typeId: newT.type.id })
				.where({ typeId: t.type.id });
			await knex('id_attribute_types')
				.where({ id: t.type.id })
				.del();
		})
	);
	await mergeAttributes(
		attributeUrlForKey('national_id'),
		{
			[attributeUrlForKey('national_id')]: 'front',
			[attributeUrlForKey('national_id_back')]: 'back'
		},
		knex,
		ctx
	);

	await knex.schema.dropTable('id_attribute_types_old');
	return ctx;
};

const mergeAttributes = async (target, attrs, knex, ctx) => {
	let attrsToMerge = await knex('id_attribute_types')
		.join('id_attributes', 'id_attributes.typeId', 'id_attribute_types.id')
		.select('id_attributes.*', 'id_attribute_types.url')
		.whereIn('id_attribute_types.url', Object.keys(attrs));

	if (!attrsToMerge.length) return;
	let targetAttrType = await knex('id_attribute_types')
		.select()
		.where({ url: target });
	if (!targetAttrType.length) {
		let content = getAttribute(target);
		targetAttrType = {
			url: target,
			content: content ? JSON.stringify(content) : null,
			expires: ctx.now,
			createdAt: ctx.now,
			updatedAt: ctx.now
		};
		let ids = await knex('id_attributes_types').insert(targetAttrType);

		targetAttrType.id = ids[0];
	} else {
		targetAttrType = targetAttrType[0];
	}

	let data = attrsToMerge.reduce((acc, curr) => {
		curr = { ...curr, data: JSON.parse(curr.data) };
		let key = attrs[curr.url];
		let value = curr.data ? curr.data.value : null;
		acc[curr.walletId] = acc[curr.walletId] || {};
		acc[curr.walletId][key] = value;
		return acc;
	}, {});

	let typeIds = attrsToMerge.map(attr => attr.typeId).filter(t => targetAttrType.id !== t);

	await knex('id_attribute_types')
		.whereIn('id', typeIds)
		.del();

	for (let walletId in data) {
		let attrsIds = attrsToMerge
			.filter(attr => +attr.walletId === +walletId)
			.map(attr => attr.id);

		let targetAttr = {
			typeId: targetAttrType.id,
			data: JSON.stringify({ value: data[walletId] }),
			walletId: walletId,
			createdAt: ctx.now,
			updatedAt: ctx.now
		};

		let ids = await knex('id_attributes').insert(targetAttr);

		await knex('id_attributes')
			.whereIn('id', attrsIds)
			.del();
		await knex('documents')
			.update({ attributeId: ids[0] })
			.whereIn('attributeId', attrsIds);
	}
};

const migrateIdentityAttributes = async (ctx, knex, Promise) => {
	await knex.schema.renameTable('id_attributes', 'id_attributes_old');
	await knex.schema.renameTable('documents', 'documents_old');
	await knex.schema.renameTable('id_attribute_types', 'id_attribute_types_old');
	await knex.schema.createTable('id_attribute_types', t => {
		t.increments('id');
		t.string('key');
		t.string('category').notNullable();
		t.string('type').notNullable();
		t.string('entity').notNullable();
		t.integer('isInitial').defaultTo(0);
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});
	await knex.raw(`
		INSERT INTO id_attribute_types
		(key, category, type, entity, isInitial, createdAt, updatedAt)
		SELECT * FROM id_attribute_types_old WHERE true;
	`);
	await knex.schema.dropTable('id_attribute_types_old');
	await knex.schema.createTable('id_attributes', table => {
		table.increments('id');
		table
			.integer('walletId')
			.notNullable()
			.references('wallets.id');
		table.string('name');
		table
			.integer('typeId')
			.notNullable()
			.references('id_attribute_types.id');
		table
			.text('data')
			.notNullable()
			.defaultTo('{}');
		table.integer('createdAt').notNullable();
		table.integer('updatedAt');
	});

	await knex.schema.createTable('documents', table => {
		table.increments('id');
		table.string('name').notNullable();
		table.string('mimeType').notNullable();
		table.integer('size').notNullable();
		table.binary('buffer').notNullable();
		table
			.integer('attributeId')
			.notNullable()
			.references('id_attributes.id');
		table.integer('createdAt').notNullable();
		table.integer('updatedAt');
	});

	await knex.raw(`
		INSERT INTO id_attributes
		SELECT
			attr.id as id,
			attr.walletId as walletId,
			t.key as name,
			t.id as typeId,
			attr.data as data,
			attr.createdAt,
			attr.updatedAt
		FROM id_attributes_old AS attr, id_attribute_types as t
		WHERE attr.type == t.key;
	`);

	await knex.raw(`
		INSERT INTO documents
		SELECT
			doc.id as id,
			doc.name as name,
			doc.mimeType as mimeType,
			doc.size as size,
			doc.buffer as buffer,
			attr.id as attributeId,
			doc.createdAt as createdAt,
			doc.updatedAt as updateAt
		FROM id_attributes_old as attr, documents_old as doc
		WHERE attr.documentId == doc.id;
	`);
	let attrs = (await knex.raw(`
		SELECT id_attributes.*, id_attributes_old.type
		FROM id_attributes, id_attributes_old
		WHERE id_attributes.id == id_attributes_old.id;
	`)).map(attr => {
		let data = JSON.parse(attr.data);
		if (!data.value) {
			data = { value: data };
		}
		if (attr.type === 'phonenumber_countrycode') {
			data.value = data.value.countryCode + data.value.telephoneNumber;
		}
		if (['physical_address', 'work_place'].includes(attr.type)) {
			data.value = {
				'address-line-1': data.value.address1 || '',
				'address-line-2': data.value.address2 || '',
				'address-line-3': [
					data.value.zip,
					data.value.city,
					data.value.region,
					data.value.country
				]
					.filter(x => !!x)
					.join(', ')
			};
		}
		if (['fingerprint'].includes(attr.type)) {
			data.value = { image: 0 };
		}
		if (['voice_id'].includes(attr.type)) {
			data.value = { audio: 0 };
		}
		if (['drivers_license'].includes(attr.type)) {
			data.value = { front: 0 };
		}
		attr.data = JSON.stringify(data);
		delete attr.type;
		return attr;
	});

	await Promise.all(
		attrs.map(attr =>
			knex('id_attributes')
				.update(attr)
				.where({ id: attr.id })
		)
	);

	await knex.schema.dropTable('documents_old');
	await knex.schema.dropTable('id_attributes_old');
	return ctx;
};

const downgradeAttributeTypes = async (knex, Promise) => {
	// TODO: implement downgrade attribute types
};

const downgradeIdentityAttributes = async (knex, Promise) => {
	// TODO: implement downgrade attributes
};

exports.up = async (knex, Promise) => {
	let ctx = {
		now: Date.now()
	};

	await knex.schema.createTable('repository', t => {
		t.increments('id');
		t.string('url');
		t.string('name');
		t.boolean('eager').defaultTo(false);
		t.string('content').defaultTo('{}');
		t.integer('expires');
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});

	ctx = populateInitialRepo(ctx, knex, Promise);

	await knex.schema.createTable('ui_schema', t => {
		t.increments('id');
		t.integer('repositoryId')
			.notNullable()
			.references('repository.id');
		t.integer('attributeTypeId')
			.notNullable()
			.references('id_attribute_types.id');
		t.string('url');
		t.string('content');
		t.integer('expires');
		t.integer('createdAt').notNullable();
		t.integer('updatedAt');
	});
	ctx = await migrateIdentityAttributes(ctx, knex, Promise);
	ctx = await migrateAttributeTypes(ctx, knex, Promise);
	return ctx;
};

exports.down = async (knex, Promise) => {
	await downgradeIdentityAttributes(knex, Promise);
	await downgradeAttributeTypes(knex, Promise);
	await knex.schema.dropTable('ui_schema');
	await knex.schema.dropTable('repository');
};
