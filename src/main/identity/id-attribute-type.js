import { Model, transaction } from 'objection';
import BaseModel from '../common/base-model';
import { isDevMode } from 'common/utils/common';
import { jsonSchema } from 'common/identity/utils';
import { Logger } from 'common/logger';
const env = isDevMode() ? 'development' : 'production';
const log = new Logger('id-attribute-type-model');

const TABLE_NAME = 'id_attribute_types';

const ID_ATTRIBUTE_TYPE_EXPIRES = 86400000; // 1 day

export class IdAttributeType extends BaseModel {
	static get tableName() {
		return TABLE_NAME;
	}

	static get idColumn() {
		return 'id';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['url'],
			properties: {
				id: { type: 'integer' },
				url: { type: 'string' },
				defaultRepositoryId: { type: 'integer' },
				content: { type: 'object' },
				expires: { type: 'integer' },
				env: { type: 'string', enum: ['production', 'development'], default: env }
			}
		};
	}

	static get relationMappings() {
		const Repository = require('./repository').default;
		const UiSchema = require('./ui-schema').default;
		const IdAttribute = require('./id-attribute').default;

		return {
			defaultRepository: {
				relation: Model.HasOneRelation,
				modelClass: Repository,
				join: {
					from: `${this.tableName}.defaultRepositoryId`,
					to: `${Repository.tableName}.id`
				}
			},
			uiSchemas: {
				relation: Model.HasManyRelation,
				modelClass: UiSchema,
				join: {
					from: `${this.tableName}.id`,
					to: `${UiSchema.tableName}.attributeTypeId`
				}
			},
			idAttributes: {
				relation: Model.HasManyRelation,
				modelClass: IdAttribute,
				join: {
					from: `${this.tableName}.id`,
					to: `${IdAttribute.tableName}.typeId`
				}
			},
			repositories: {
				relation: Model.ManyToManyRelation,
				modelClass: Repository,
				join: {
					from: `${this.tableName}.id`,
					through: {
						from: 'repository_attribute_types.attributeTypeId',
						to: 'repository_attribute_types.repositoryId'
					},
					to: `${Repository.tableName}.id`
				}
			}
		};
	}

	static create(data, tx) {
		return this.query(tx).insertAndFetch({ ...data, env });
	}

	static findById(id, tx) {
		return this.query(tx).findById(id);
	}

	static findAll(tx) {
		return this.query(tx).where({ env });
	}

	static findByUrl(url, tx) {
		return this.query(tx).findOne({ url, env });
	}

	static async loadRemote(url) {
		const Repository = require('./repository').default;
		let defaultRepo = null;
		let remote = await jsonSchema.loadRemoteSchema(url, { env });
		remote = await jsonSchema.dereference(remote, { env });
		let repoUrl = jsonSchema.getDefaultRepo(remote, { env });
		if (repoUrl) {
			defaultRepo = await Repository.findByUrl(repoUrl);
			if (!defaultRepo) {
				defaultRepo = await Repository.addRemoteRepo(repoUrl);
			}
		}
		let remoteAttrType = {
			url,
			content: remote,
			expires: Date.now() + (remote.expires || ID_ATTRIBUTE_TYPE_EXPIRES)
		};
		if (defaultRepo) remoteAttrType.defaultRepositoryId = defaultRepo.id;
		return remoteAttrType;
	}

	static async addRemote(url) {
		let [remote, attrType] = await Promise.all([this.loadRemote(url), this.findByUrl(url)]);
		if (!remote) {
			log.error('could not load attribute type %s from remote', url);
			return;
		}
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

export default IdAttributeType;
