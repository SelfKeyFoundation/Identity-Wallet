import _ from 'lodash';
import { Model, transaction } from 'objection';
import { Logger } from 'common/logger';
import BaseModel from '../common/base-model';
import { genRandId } from 'common/utils/crypto';

const log = new Logger('id-attribute-model');
const TABLE_NAME = 'id_attributes';

export class IdAttribute extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['walletId', 'type'],
			properties: {
				id: { type: 'integer' },
				walletId: { type: 'integer' },
				type: { type: 'string' },
				data: { type: 'object' },
				documentId: { type: 'integer' }
			}
		};
	}

	static get relationMappings() {
		const Wallet = require('../wallet/wallet').default;
		const IdAttributeType = require('./id-attribute-type').default;
		const Document = require('./document').default;
		return {
			wallet: {
				relation: Model.BelongsToOneRelation,
				modelClass: Wallet,
				join: {
					from: `${this.tableName}.walletId`,
					to: `${Wallet.tableName}.id`
				}
			},
			attributeType: {
				relation: Model.BelongsToOneRelation,
				modelClass: IdAttributeType,
				join: {
					from: `${this.tableName}.type`,
					to: `${IdAttributeType.tableName}.key`
				}
			},
			document: {
				relation: Model.BelongsToOneRelation,
				modelClass: Document,
				join: {
					from: `${this.tableName}.documentId`,
					to: `${Document.tableName}.id`
				}
			}
		};
	}

	static async create(attr) {
		const tx = await transaction.start(this.knex());
		try {
			attr = await this.query(tx).insertGraphAndFetch(attr);
			await tx.commit();
			return attr;
		} catch (error) {
			await tx.rollback(error);
			throw error;
		}
	}

	static addDocuemnt(id, document) {
		return this.update({ id, document });
	}

	static addData(id, data) {
		return this.update({ id, data });
	}

	static findAllByWalletId(walletId) {
		return this.query().where({ walletId });
	}

	static async update(attr) {
		const tx = await transaction.start(this.knex());
		try {
			attr = await this.query(tx).upsertGraphAndFetch(attr);
			await tx.commit();
			return attr;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}

	static async delete(id) {
		const tx = await transaction.start(this.knex());
		try {
			let attr = await this.query(tx)
				.findById(id)
				.eager('document');
			if (attr.document) await attr.document.$query(tx).delete();
			await attr.$query(tx).delete();
			await tx.commit();
			return attr;
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
		const WalletSetting = require('../wallet/wallet-setting').default;
		const Document = require('./document').default;
		const tx = await transaction.start(this.knex());
		try {
			let walletSetting = await WalletSetting.findByWalletId(walletId, tx);
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
									log.error(error);
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
					idAttributesSavePromises.push(
						IdAttribute.query(tx).insertAndFetch(itemsToSave[i])
					);
				})(i);
			}
			await Promise.all(idAttributesSavePromises);
			walletSetting = await WalletSetting.updateById(walletSetting.id, walletSetting, tx);
			await tx.commit();
			return walletSetting;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}

	static async genInitial(walletId, initialIdAttributes, tx) {
		const IdAttributeTypes = require('./id-attribute-type').default;
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
		const IdAttributeTypes = require('./id-attribute-type').default;
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

export default IdAttribute;

function getIdAttributeItemValue(idAttribute, itemId, valueId) {
	let item = _.find(idAttribute.items, { id: itemId });
	let value = null;
	if (item && item.values && item.values.length) {
		value = _.find(item.values, { id: valueId });
	}
	return value;
}

function generateIdAttributeObject(walletId, idAttributeType, staticData, document) {
	const value = {
		id: genRandId(),
		order: 0
	};
	if (staticData) value.staticData = staticData;
	if (document) {
		value.documentId = document.id;
		value.documentName = document.name;
	}
	return {
		walletId: walletId,
		idAttributeType: idAttributeType,
		items: [
			{
				id: genRandId(),
				name: null,
				isVerified: 0,
				order: 0,
				values: [value]
			}
		]
	};
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
