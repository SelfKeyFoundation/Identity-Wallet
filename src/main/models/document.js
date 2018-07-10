const BaseModel = require('./base');
const TABLE_NAME = 'documents';

class Document extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			properties: {
				id: { type: 'integer' },
				name: { type: 'string' },
				mimeType: { type: 'string' },
				size: { type: 'integer' },
				buffer: { type: 'binary' }
			}
		};
	}

	static async findById(id) {
		return this.query().findById(id);
	}

	static create(itm, tx) {
		return this.query(tx).insertAndFetch(itm);
	}

	static delete(id, tx) {
		return this.query(tx).deleteById(id);
	}
}

module.exports = Document;
