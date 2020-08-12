import { Model } from 'objection';
import BaseModel from '../common/base-model';

const TABLE_NAME = 'messages';

export class Message extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['processId', 'sender', 'reciever', 'status', 'message'],
			properties: {
				processId: { type: 'string' },
				sender: { type: 'string' },
				reciever: { type: 'string' },
				status: { type: 'string' },
				message: { type: 'string' }
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

	static async create(data) {
		try {
			const newQuestion = await this.query().insert(data);
			return newQuestion;
		} catch (err) {
			console.log(err);
		}
	}

	static async update(id, data) {
		const updated = await this.query().patchAndFetchById(id, data);
		return updated;
	}

	static async delete(id) {
		const deleted = await this.query()
			.delete()
			.where({ id });
		return deleted;
	}
}

export default Message;
