import { Model, transaction } from 'objection';
import BaseModel from '../common/base-model';
import fetch from 'node-fetch';
import { Logger } from 'common/logger';

const log = new Logger('ui-schema-model');

const UI_SCHEMA_EXPIRES = 86400000; // 1 day

const TABLE_NAME = 'ui_schema';

export class UiSchema extends BaseModel {
	static tableName = TABLE_NAME;
	static idColumn = 'id';
	static jsonSchema = {
		type: 'object',
		required: ['url', 'repositoryId', 'attributeTypeId'],
		properties: {
			id: { type: 'integer' },
			url: { type: 'string' },
			repositoryId: { type: 'integer' },
			attributeTypeId: { type: 'integer' },
			content: { type: 'object' },
			expires: { type: 'integer' }
		}
	};

	static get relationMappings() {
		const IdAttributeType = require('./id-attribute-type').default;
		const Repository = require('./repository').default;
		return {
			idAttributeType: {
				relation: Model.HasOneRelation,
				modelClass: IdAttributeType,
				join: {
					from: `${this.tableName}.attributeTypeId`,
					to: `${IdAttributeType.tableName}.id`
				}
			},
			repository: {
				relation: Model.HasOneRelation,
				modelClass: Repository,
				join: {
					from: `${this.tableName}.repositoryId`,
					to: `${Repository.tableName}.id`
				}
			}
		};
	}

	static findByUrl(url, repositoryId, tx) {
		return this.query(tx).findOne({ url, repositoryId });
	}

	static async findById(id, tx) {
		return this.query(tx).findById(id);
	}

	static create(itm, tx) {
		return this.query(tx).insertAndFetch(itm);
	}

	static delete(id, tx) {
		return this.query(tx).deleteById(id);
	}

	static async loadRemote(url) {
		let res = await fetch(url);
		if (res.statusCode >= 400) {
			throw new Error('Failed to fetch ui-schema from remote');
		}
		let remote = await res.json();

		let remoteSchema = {
			url,
			content: remote,
			expires: Date.now() + (remote.expires || UI_SCHEMA_EXPIRES)
		};

		return remoteSchema;
	}

	static async addRemote(url, repositoryId, attributeTypeId) {
		let [remote, attrType] = await Promise.all([
			this.loadRemote(url),
			this.findByUrl(url, repositoryId)
		]);
		if (!remote) {
			log.error('could not load ui schema %s from remote', url);
			return;
		}
		remote.repositoryId = repositoryId;
		remote.attributeTypeId = attributeTypeId;
		const tx = await transaction.start(this.knex());
		try {
			if (!attrType) {
				attrType = await this.create(remote, tx);
			} else {
				attrType = await attrType.$query(tx).patchAndFetch(remote);
			}

			await tx.commit();
			return attrType;
		} catch (error) {
			log.error(error);
			await tx.rollback(error);
			throw error;
		}
	}
}

export default UiSchema;
