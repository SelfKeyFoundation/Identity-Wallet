import { Model } from 'objection';
import BaseModel from '../common/base-model';

const TABLE_NAME = 'certifier_processes';

export class CertifierProcess extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['userId', 'processType'],
			properties: {
				processId: { type: 'string' },
				certifierId: { type: 'string' },
				userId: { type: 'string' },
				processType: { type: 'string' },
				processStatus: { type: 'string' },
				kycStatus: { type: 'string' }
			}
		};
	}

	static get relationMappings() {
		const ClaimDocument = require('./claim-document').default;
		const Question = require('./question').default;
		const Message = require('./message').default;
		return {
			claim: {
				relation: Model.BelongsToOneRelation,
				modelClass: ClaimDocument,
				join: {
					from: `${this.tableName}.id`,
					to: `${ClaimDocument.tableName}.id`
				}
			},
			question: {
				relation: Model.BelongsToOneRelation,
				modelClass: Question,
				join: {
					from: `${this.tableName}.id`,
					to: `${Question.tableName}.id`
				}
			},
			message: {
				relation: Model.BelongsToOneRelation,
				modelClass: Message,
				join: {
					from: `${this.tableName}.id`,
					to: `${Message.tableName}.id`
				}
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

	static async postData(url = 'https://localhost:3008/process', data = {}) {
		const response = await fetch(url, {
			method: 'POST',
			mode: '*cors',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		return await response.json();
	}

	static async create(data) {
		try {
			let APIRes = await postData(data);
			const newProcess = await this.query().insert(data);
			return newProcess;
		} catch (err) {
			console.log(err);
		}
	}

	static async update(id, data) {
		const updatedProcess = await this.query().patchAndFetchById(id, data);
		return updatedProcess;
	}

	static async delete(id) {
		const deletedProcess = await this.query()
			.delete()
			.where({ id });
		return deletedProcess;
	}
}

export default CertifierProcess;
