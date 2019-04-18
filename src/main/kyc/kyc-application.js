import BaseModel from '../common/base-model';

const TABLE_NAME = 'kyc_applications';

export class KycApplication extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			// required: ['walletId', 'label', 'address'],
			properties: {
				id: { type: 'string' },
				owner: { type: 'string' },
				scope: { type: 'string' },
				rpName: { type: 'string' },
				currentStatus: { type: 'integer' },
				currentStatusName: { type: 'string' },
				applicationDate: { type: 'string' },
				payments: { type: 'object' },
				nextRoute: { type: 'string' }
			}
		};
	}

	static findAll() {
		return this.query();
	}

	static create(itm) {
		return this.query().insertAndFetch(itm);
	}

	static update(itm) {
		const id = itm.id;
		delete itm.id;
		return this.query().patchAndFetchById(id, itm);
	}

	static delete(id) {
		return this.query()
			.delete()
			.where({ id });
	}
}

export default KycApplication;
