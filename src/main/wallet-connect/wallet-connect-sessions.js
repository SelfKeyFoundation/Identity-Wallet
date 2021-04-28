import BaseModel from '../common/base-model';

const TABLE_NAME = 'wallet_connect_sessions';

export class WalletConnectSessions extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['address', 'session'],
			properties: {
				id: { type: 'integer' },
				address: { type: 'string' },
				name: { type: 'string', default: '' },
				url: { type: 'string', default: '' },
				session: { type: 'object', default: {} }
			}
		};
	}

	static create(data) {
		console.log(data);
		return this.query().insertAndFetch(data);
	}

	static findAll() {
		return this.query();
	}

	static updateById(id, data) {
		return this.query().patchAndFetchById(id, data);
	}

	static delete(id) {
		return this.query()
			.delete()
			.where({ id });
	}
}

export default WalletConnectSessions;
