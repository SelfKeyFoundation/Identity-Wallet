const { Model } = require('objection');
const BaseModel = require('./base');
const _ = require('lodash');
const TABLE_NAME = 'id_attribute_types';

class IdAttributeType extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'key';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['type', 'key'],
			properties: {
				key: { type: 'string' },
				category: { type: 'string' },
				type: { type: 'string' },
				entity: { type: 'array' },
				isInitial: { type: 'integer' },
				createdAt: { type: 'integer' },
				updatedAt: { type: 'integer' }
			}
		};
	}

	static create(data) {
		const type = Array.isArray(data.type) ? data.type[0] : data.type;
		const dataToSave = {
			..._.pick(data, 'key', 'entity', 'category'),
			type
		};
		return this.query().insertAndFetch(dataToSave);
	}

	static findAll() {
		return this.query();
	}

	static findInitial() {
		return this.findAll().where({ isInitial: 1 });
	}

	static import(attributeTypes) {}
}

module.exports = IdAttributeType;

// TODO
/*
derive import from this
controller.prototype.loadIdAttributeTypes = () => {
		const ID_ATTRIBUTE_TABLE = 'id-attributes';
		request.get(AIRTABLE_API + ID_ATTRIBUTE_TABLE, (error, httpResponse, result) => {
			let idAttributesArray = JSON.parse(result).ID_Attributes;
			for (let i in idAttributesArray) {
				if (!idAttributesArray[i].data) continue;

				let item = idAttributesArray[i].data.fields;

				electron.app.sqlLiteService.IdAttributeType.create(item)
					.then(idAttributeType => {
						// inserted
					})
					.catch(error => {
						// error
					});
			}
		});
	};
*/
