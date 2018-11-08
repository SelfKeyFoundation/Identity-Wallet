import BaseModel from '../common/base-model';
const TABLE_NAME = 'repository';

export class Repository extends BaseModel {
	static tableName = TABLE_NAME;
	static idColumn = 'id';
	static jsonSchema = {
		type: 'object',
		required: ['walletId', 'url'],
		properties: {
			id: { type: 'integer' },
			walletId: { type: 'integer' },
			url: { type: 'string' },
			name: { type: 'string' },
			eager: { type: 'boolean', default: false },
			expires: { type: 'integer' }
		}
	};

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

export default Repository;
