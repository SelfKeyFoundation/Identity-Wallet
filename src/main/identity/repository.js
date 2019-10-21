import { Model, transaction } from 'objection';
import BaseModel from '../common/base-model';
import { jsonSchema } from 'common/identity/utils';
import IdAttributeType from './id-attribute-type';
import { Logger } from 'common/logger';
import { UiSchema } from './ui-schema';
import config from 'common/config';
const env = config.attributeTypeSource;

const log = new Logger('repository-model');
const TABLE_NAME = 'repository';

export const REPOSITORY_EXPIRES_DEFAULT = 86400000; // 1 day
export class Repository extends BaseModel {
	static tableName = TABLE_NAME;
	static idColumn = 'id';
	static jsonSchema = {
		type: 'object',
		required: ['url'],
		properties: {
			id: { type: 'integer' },
			url: { type: 'string' },
			name: { type: 'string' },
			eager: { type: 'boolean', default: false },
			content: { type: 'object' },
			expires: { type: 'integer' },
			env: { type: 'string', enum: ['production', 'development'], default: env }
		}
	};

	static get relationMappings() {
		const IdAttributeType = require('./id-attribute-type').default;
		const UiSchema = require('./ui-schema').default;

		return {
			attributeTypes: {
				relation: Model.ManyToManyRelation,
				modelClass: IdAttributeType,
				join: {
					from: `${this.tableName}.id`,
					through: {
						from: 'repository_attribute_types.repositoryId',
						to: 'repository_attribute_types.attributeTypeId'
					},
					to: `${IdAttributeType.tableName}.id`
				}
			},
			uiSchemas: {
				relation: Model.HasManyRelation,
				modelClass: UiSchema,
				join: {
					from: `${this.tableName}.id`,
					to: `${UiSchema.tableName}.repositoryId`
				}
			}
		};
	}

	static findById(id, tx) {
		return this.query(tx).findById(id);
	}

	static findByUrl(url, tx) {
		return this.query(tx).findOne({ url, env });
	}

	static create(itm, tx) {
		return this.query(tx).insertAndFetch({ ...itm, env });
	}

	static delete(id, tx) {
		return this.query(tx).deleteById(id);
	}

	static findAll(where) {
		return this.query().where({ ...where, env } || { env });
	}

	static async loadRemote(url) {
		let remoteRepo = await jsonSchema.loadRemoteRepository(url, { env });
		return {
			url,
			name: remoteRepo.name,
			content: remoteRepo,
			expires: Date.now() + (remoteRepo.expires || REPOSITORY_EXPIRES_DEFAULT)
		};
	}

	diffAttributes(repo) {
		let incomingAttributes = repo.content.identityAttributes || [];
		let currAttr = this.content.identityAttributes || [];

		let existingMap = currAttr.reduce((acc, curr) => {
			if (typeof curr === 'string') {
				curr = { json: curr };
			}
			if (!curr.json) return;
			acc[curr.json] = curr;
			return acc;
		}, {});

		let updates = incomingAttributes.reduce(
			(acc, curr) => {
				if (typeof curr === 'string') {
					curr = { json: curr };
				}
				if (!curr.json) return acc;

				let existing = existingMap[curr.json];

				if (!existing) {
					acc.add.push(curr);
					return acc;
				}

				if (curr.ui !== existing.ui) {
					if (existing.ui) {
						acc.delete.push({ ui: existing.ui });
					}
					if (curr.ui) {
						acc.add.push(curr);
					}
				}
				delete existingMap[curr.json];
				return acc;
			},
			{
				delete: [],
				add: []
			}
		);
		for (let attr in existingMap) {
			updates.delete.push(existingMap[attr]);
		}
		return updates;
	}

	async updateAttributes(updates, tx) {
		for (let attr of updates.delete || []) {
			await this.deleteAttribute(attr, tx);
		}
		for (let attr of updates.add || []) {
			await this.addAttribute(attr, tx);
		}
	}

	async addAttribute(attr, tx) {
		if (typeof attr === 'string') {
			attr = { json: attr };
		}
		if (!attr.json) return;
		let attrType = await IdAttributeType.findByUrl(attr.json, tx);
		if (!attrType) attrType = await IdAttributeType.create({ url: attr.json }, tx);
		await attrType.$relatedQuery('repositories', tx).relate(this.id);
		if (!attr.ui) return;
		let uiSchema = await UiSchema.findByUrl(attr.ui, this.id, tx);
		if (uiSchema) return;

		await UiSchema.create(
			{
				url: attr.ui,
				repositoryId: this.id,
				attributeTypeId: attrType.id
			},
			tx
		);
	}

	async deleteAttribute(attr, tx) {
		log.info('deleting attribute type %j', attr);
		if (attr.ui) {
			let uiSchema = await UiSchema.findByUrl(attr.ui, this.id, tx);
			if (uiSchema) await uiSchema.$query(tx).delete();
		}
		if (!attr.json) return;

		let attrType = await IdAttributeType.findByUrl(attr.json, tx).eager('idAttributes');
		if (!attrType) return;
		await this.$relatedQuery('attributeTypes', tx)
			.unrelate()
			.where('id', attrType.id);
		await attrType.$loadRelated('[repositories, idAttributes]', null, tx);

		if (!attrType.repositories.length && !attrType.idAttributes.length)
			await attrType.$query(tx).delete();
	}

	static async addRemoteRepo(url) {
		let [remote, repo] = await Promise.all([this.loadRemote(url), this.findByUrl(url)]);
		if (!remote) {
			log.error('could not load repo %s from remote', url);
			return;
		}
		const tx = await transaction.start(this.knex());
		try {
			if (!repo) {
				repo = await this.create({ url, content: {} }, tx);
			}

			let updates = repo.diffAttributes(remote);

			await repo.updateAttributes(updates, tx);
			repo = await repo.$query(tx).patchAndFetch(remote);
			await tx.commit();
			return repo;
		} catch (error) {
			log.error(error);
			await tx.rollback(error);
			throw error;
		}
	}
}

export default Repository;
