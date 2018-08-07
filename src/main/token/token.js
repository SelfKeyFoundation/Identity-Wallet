import BaseModel from '../common/base-model';

const TABLE_NAME = 'tokens';

export class Token extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['symbol', 'decimal', 'address'],
			properties: {
				id: { type: 'integer' },
				symbol: { type: 'string' },
				decimal: { type: 'integer' },
				address: { type: 'string' },
				icon: { type: 'binary' },
				isCustom: { type: 'integer' }
			}
		};
	}

	static create(itm) {
		return this.query().insertAndFetch(itm);
	}

	static update(itm) {
		return this.query().patchAndFetchById(itm.id, itm);
	}

	static findAll() {
		return this.query();
	}

	static findBySymbol(symbol) {
		return this.query().where({ symbol });
	}
}

export default Token;
