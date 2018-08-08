import _ from 'lodash';
import { Model, transaction } from 'objection';
import { Logger } from 'common/logger';
import BaseModel from '../common/base-model';
import { genRandId } from 'common/utils/crypto';

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
		const tx = await transaction.start(this.knex());
		try {
			let walletSetting = await WalletSetting.findByWalletId(walletId, tx);

			let docAttrs = requiredDocuments
				.filter(req => !!req.attributeType)
				.map(req =>
					req.docs.reduce((acc, doc) => {
						acc.concat(
							doc.fileItems.map(f => ({
								type: req.attributeType,
								walletId,
								document: {
									name: f.name,
									mimeType: f.mimeType,
									size: f.size,
									buffer: f.buffer
								}
							}))
						);
						return acc;
					}, [])
				)
				.reduce((acc, docs) => {
					acc.concat(docs);
					return acc;
				}, []);

			let dataAttrs = requiredStaticData.filter(req => !!req.attributeType).map(req => {
				let staticData = {};
				for (let j in req.staticDatas) {
					let answer = req.staticDatas[j];
					staticData['line' + (parseInt(j) + 1).toString()] = answer;
				}
				return {
					walletId,
					type: req.attributeType,
					data: staticData
				};
			});

			walletSetting.airDropCode = exportCode;

			await Promise.all(
				[...docAttrs, ...dataAttrs].map(attr => this.query(tx).insertGraph(attr))
			);

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
			.whereIn('type', typeKeys);
		let existingTypes = {};

		attributes = attributes.map(attr => {
			const type = attr.type;
			existingTypes[type] = true;
			if (initialIdAttributes[type]) {
				attr.data.value = initialIdAttributes[type];
			}
			return attr;
		});

		typeKeys.forEach(type => {
			if (existingTypes[type]) return;
			let attr = {
				walletId,
				type,
				data: { value: initialIdAttributes[type] }
			};

			attributes.push(attr);
		});
		return attributes;
	}
}

export default IdAttribute;
