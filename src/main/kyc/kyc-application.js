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
			required: ['id', 'rpName'],
			properties: {
				id: { type: 'string' },
				owner: { type: 'string' },
				scope: { type: 'string' },
				rpName: { type: 'string' },
				title: { type: 'string' },
				sub_title: { type: 'string' },
				currentStatus: { type: 'integer' },
				currentStatusName: { type: 'string' },
				applicationDate: { type: 'string' },
				payments: { type: 'object' },
				nextRoute: { type: 'string' },
				walletId: { type: 'integer' }
			}
		};
	}

	static async findById(id) {
		return this.query().findById(id);
	}

	static findAll(walletId) {
		return this.query().where({ walletId });
	}

	static async create(itm) {
		itm.title = itm.title ? itm.title : itm.rpName;
		try {
			await this.query().insert(itm);
		} catch (err) {
			console.log(err);
		}
	}

	static async update(itm) {
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
