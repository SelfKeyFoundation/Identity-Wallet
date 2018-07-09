const _ = require('lodash');
const { genRandId } = require('../utils/crypto');
const BaseModel = require('./base');
const { Model, transaction } = require('objection');
const TABLE_NAME = 'id_attributes';

class IdAttribute extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['walletId', 'idAttributeType'],
			properties: {
				id: { type: 'integer' },
				walletId: { type: 'integer' },
				idAttributeType: { type: 'string' },
				items: { type: 'array' },
				order: { type: 'integer' }
			}
		};
	}

	static get relationMappings() {
		const Wallet = require('./wallet');
		const IdAttributeType = require('./id-attribute-type');
		return {
			wallet: {
				relation: Model.BelongsToOneRelation,
				modelClass: Wallet,
				join: {
					from: `${this.tableName}.walletId`,
					to: `${Wallet.tableName}.id`
				}
			},
			type: {
				relation: Model.BelongsToOneRelation,
				modelClass: IdAttributeType,
				join: {
					from: `${this.tableName}.idAttributeType`,
					to: `${IdAttributeType.tableName}.key`
				}
			}
		};
	}

	static async create(walletId, idAttributeType, staticData, file) {
		const Document = require('./document');
		const tx = await transaction.start(this.knex());
		try {
			let attr = await this.query(tx)
				.findOne()
				.where({ walletId, idAttributeType });
			if (attr) throw new Error('id_attribute_already_exists');
			let document = null;
			if (file) {
				document = await Document.create(_.omit(file, 'path'), tx);
			}
			let idAttribute = generateIdAttributeObject(
				walletId,
				idAttributeType,
				staticData,
				document
			);
			let itm = this.query(tx).insertAndFetch(idAttribute);
			await tx.commit();
			return itm;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}

	static async addEditDocumentToIdAttributeItemValue(
		idAttributeId,
		idAttributeItemId,
		idAttributeItemValueId,
		file
	) {
		const Document = require('./document');
		const tx = await transaction.start(this.knex());
		try {
			let idAttribute = await this.query(tx).findById(idAttributeId);
			if (!idAttribute) throw new Error('id_attribute_not_found');
			let value = getIdAttributeItemValue(
				idAttribute,
				idAttributeItemId,
				idAttributeItemValueId
			);
			if (value) {
				await Document.delete(value.documentId, tx);
			}
			let document = await Document.create(
				_.pick(file, 'buffer', 'name', 'mimeType', 'size'),
				tx
			);
			value.documentId = document.id;
			value.documentName = document.name;
			idAttribute = this.query(tx).patchAndFetchById(idAttributeId, idAttribute);
			await tx.commit();
			return idAttribute;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}

	static async addEditStaticDataToIdAttributeItemValue(
		idAttributeId,
		idAttributeItemId,
		idAttributeItemValueId,
		staticData
	) {
		const tx = await transaction.start(this.knex());
		try {
			let idAttribute = await this.query(tx).findById(idAttributeId);
			if (!idAttribute) throw new Error('id_attribute_not_found');

			let value = getIdAttributeItemValue(
				idAttribute,
				idAttributeItemId,
				idAttributeItemValueId
			);

			value.staticData = staticData;

			idAttribute = this.query(tx).patchAndFetchById(idAttribute.id, idAttribute);
			await tx.commit();
			return idAttribute;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}

	static async findAllByWalletId(walletId) {
		let attrs = await this.query().where(walletId);
		return attrs.reduce((acc, attr) => {
			if (_.find(acc, { idAttributeType: attr.idAttributeType })) return acc;
			acc[attr.id] = attr;
			return acc;
		}, {});
	}

	static async delete(idAttributeId, idAttributeItemId, idAttributeItemValueId) {
		const Document = require('./document');
		const tx = transaction.start(this.knex());
		try {
			let idAttribute = this.query(tx).findById(idAttributeId);
			let value = getIdAttributeItemValue(
				idAttribute,
				idAttributeItemId,
				idAttributeItemValueId
			);
			if (value && value.documentId) {
				await Document.delete(value.documentId, tx);
			}
			await this.query(tx).deleteById(idAttributeId);
			await tx.comit();
			return idAttribute;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}

	static async addImportedIdAttributes(
		walletId,
		exportCode,
		requiredDocuments,
		requiredStaticData
	) {
		const WalletSetting = require('./wallet-setting');
		const Document = require('./document');
		const tx = await transaction.start(this.knex());
		try {
			let walletSetting = await WalletSetting.findByWalletId(walletId);
			let idAttributesSavePromises = [];
			let documentsSavePromises = [];

			let itemsToSave = {};

			for (let i in requiredDocuments) {
				let requirement = requiredDocuments[i];
				if (!requirement.attributeType) continue;

				let idAttribute = generateEmptyIdAttributeObject(
					walletId,
					requirement.attributeType
				);
				idAttribute.tempId = genRandId();

				for (let j in requirement.docs) {
					let fileItems = requirement.docs[j].fileItems;
					let idAttributeItem = generateEmptyIdAttributeItemObject();
					idAttribute.items.push(idAttributeItem);

					for (let k in fileItems) {
						let fileItem = fileItems[k];
						let idAttributeItemValue = generateEmptyIdAttributeItemValueObject();
						idAttributeItem.values.push(idAttributeItemValue);

						let document = {
							name: fileItem.name,
							mimeType: fileItem.mimeType,
							size: fileItem.size,
							buffer: fileItem.buffer,
							createdAt: Date.now()
						};

						documentsSavePromises.push(
							Document.create(document, tx)
								.then(document => {
									idAttributeItemValue.documentId = document.id;
									idAttributeItemValue.documentName = document.name;
									itemsToSave[idAttribute.tempId] = idAttribute;
								})
								.catch(error => {
									console.log(error);
								})
						);
					}
				}
			}

			for (let i in requiredStaticData) {
				let requirement = requiredStaticData[i];
				if (!requirement.attributeType) continue;

				let staticData = {};
				for (let j in requirement.staticDatas) {
					let answer = requirement.staticDatas[j];
					staticData['line' + (parseInt(j) + 1).toString()] = answer;
				}

				let idAttribute = generateIdAttributeObject(
					walletId,
					requirement.attributeType,
					staticData,
					null
				);
				idAttribute.tempId = genRandId();

				itemsToSave[idAttribute.tempId] = idAttribute;
			}

			walletSetting.airDropCode = exportCode;

			await Promise.all(documentsSavePromises);

			for (let i in itemsToSave) {
				(function() {
					delete itemsToSave[i].tempId;
					itemsToSave[i].items = JSON.stringify(itemsToSave[i].items);
					idAttributesSavePromises.push(
						IdAttribute.query(tx).insertAndFetch(itemsToSave[i])
					);
				})(i);
			}
			await Promise.all(idAttributesSavePromises);
			await WalletSetting.updateById(walletSetting.id, walletSetting, tx);
			await tx.commit();
			return walletSetting;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}

	static async genInitial(walletId, initialIdAttributes, tx) {
		const IdAttributeTypes = require('./id-attribute-type');
		let idAttributeTypes = await IdAttributeTypes.findInitial(tx);
		const attrs = [];
		for (let i in idAttributeTypes) {
			let idAttributeType = idAttributeTypes[i];

			let item = {
				walletId,
				idAttributeType: idAttributeType.key,
				items: [],
				createdAt: Date.now()
			};

			item.items.push({
				id: genRandId(),
				name: null,
				isVerified: 0,
				order: 0,
				createdAt: Date.now(),
				updatedAt: null,
				values: [
					{
						id: genRandId(),
						staticData: {
							line1: initialIdAttributes[idAttributeType.key]
						},
						documentId: null,
						order: 0,
						createdAt: Date.now(),
						updatedAt: null
					}
				]
			});
			attrs.push(item);
		}
		return attrs;
	}

	static async initializeImported(walletId, initialIdAttributes, tx) {
		const IdAttributeTypes = require('./id-attribute-type');
		let idAttributeTypes = await IdAttributeTypes.findInitial(tx);
		let typeKeys = _.map(idAttributeTypes, ({ key }) => key);
		let attributes = await this.query(tx)
			.where({ walletId })
			.whereIn('idAttributeType', typeKeys);
		let existingTypes = {};

		attributes = attributes.map(idAttribute => {
			const type = idAttribute.idAttributeType;
			existingTypes[type] = true;
			if (initialIdAttributes[type]) {
				idAttribute.items[0].values[0].staticData.line1 = initialIdAttributes[type];
			}
			return idAttribute;
		});

		typeKeys.forEach(type => {
			if (existingTypes[type]) return;
			let idAttribute = {
				walletId,
				idAttributeType: type,
				items: [],
				createdAt: Date.now()
			};

			idAttribute.items.push({
				id: genRandId(),
				name: null,
				isVerified: 0,
				order: 0,
				createdAt: Date.now(),
				updatedAt: null,
				values: [
					{
						id: genRandId(),
						staticData: {
							line1: initialIdAttributes[type]
						},
						documentId: null,
						order: 0,
						createdAt: Date.now(),
						updatedAt: null
					}
				]
			});
			attributes.push(idAttribute);
		});
		return attributes;
	}
}

module.exports = IdAttribute;

function getIdAttributeItemValue(idAttribute, itemId, valueId) {
	let item = _.find(idAttribute.items, { id: itemId });
	let value = null;
	if (item && item.values && item.values.length) {
		value = _.find(item.values, { id: valueId });
	}
	return value;
}

function generateIdAttributeObject(walletId, idAttributeType, staticData, document) {
	const ts = Date.now();
	let item = {
		walletId: walletId,
		idAttributeType: idAttributeType,
		items: [],
		createdAt: ts
	};

	item.items.push({
		id: genRandId(),
		name: null,
		isVerified: 0,
		order: 0,
		createdAt: ts,
		updatedAt: null,
		values: [
			{
				id: genRandId(),
				staticData: staticData || {},
				documentId: document ? document.id : null,
				documentName: document ? document.name : null,
				order: 0,
				createdAt: ts,
				updatedAt: null
			}
		]
	});

	return item;
}

function generateEmptyIdAttributeObject(walletId, idAttributeType) {
	let item = {
		walletId: walletId,
		idAttributeType: idAttributeType,
		items: [],
		createdAt: Date.now()
	};
	return item;
}

function generateEmptyIdAttributeItemObject(name) {
	let item = {
		id: genRandId(),
		name: name || null,
		isVerified: 0,
		order: 0,
		createdAt: Date.now(),
		updatedAt: null,
		values: []
	};
	return item;
}

function generateEmptyIdAttributeItemValueObject() {
	let item = {
		id: genRandId(),
		staticData: {},
		documentId: null,
		documentName: null,
		order: 0,
		createdAt: Date.now(),
		updatedAt: null
	};
	return item;
}
