import BaseModel from '../common/base-model';
import { Model } from 'objection';

const TABLE_NAME = 'address_book';

export class AddressBook extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['walletId', 'label', 'address'],
			properties: {
				id: { type: 'integer' },
				walletId: { type: 'integer' },
				label: { type: 'string' },
				address: { type: 'string' }
			}
		};
	}

	static get relationMappings() {
		const Wallet = require('../wallet/wallet').default;
		return {
			wallet: {
				relation: Model.BelongsToOneRelation,
				modelClass: Wallet,
				join: {
					from: `${this.tableName}.walletId`,
					to: `${Wallet.tableName}.id`
				}
			}
		};
	}

	static findAll() {
		return this.query();
	}

	static findAllByWalletId(walletId) {
		return this.query().where({ walletId });
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

export default AddressBook;
