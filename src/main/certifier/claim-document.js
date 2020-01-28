import { Model } from 'objection';
import BaseModel from '../common/base-model';

import { issueDocument } from './libs/oa';

const TABLE_NAME = 'claim_documents';

export class ClaimDocument extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['data', 'signature'],
			properties: {
				schema: { type: 'string' },
				data: { type: 'object' },
				privacy: { type: 'object' },
				signature: { type: 'object' }
			}
		};
	}

	static async findById(id) {
		return this.query().findById(id);
	}

	static findAll(argv) {
		if (argv) {
			return this.query().where(argv);
		} else {
			return this.query();
		}
	}

	static async create(data, schema) {
		try {
			const doc = await issueDocument(data, schema);
			const entry = await this.query().insert(doc);
			return entry;
		} catch (err) {
			console.log(err);
		}
	}

	static async delete(id) {
		const deleted = await this.query()
			.delete()
			.where({ id });
		return deleted;
	}
}

export default ClaimDocument;
