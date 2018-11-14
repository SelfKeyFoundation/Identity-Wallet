import { Model } from 'objection';
import BaseModel from '../common/base-model';
import fetch from 'node-fetch';
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
			expires: { type: 'integer' }
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

	static async findById(id) {
		return this.query().findById(id);
	}

	static create(itm, tx) {
		return this.query(tx).insertAndFetch(itm);
	}

	static delete(id, tx) {
		return this.query(tx).deleteById(id);
	}

	static findAll(where) {
		return this.query().where(where || {});
	}

	static async loadRemote(url) {
		let res = await fetch(url);
		if (res.statusCode >= 400) {
			throw new Error('Failed to fetch repository from remote');
		}
		let remoteRepo = await res.json();
		return {
			url,
			name: remoteRepo.name,
			content: remoteRepo,
			expires: remoteRepo.expires || REPOSITORY_EXPIRES_DEFAULT
		};
	}

	diffAttributes(repo) {
		let incomingAttributes = repo.content.identityAttributes;
		let currAttr = this.content.identityAttributes;

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
			{ delete: [], add: [] }
		);

		for (let attr in existingMap) {
			updates.delete.push(existingMap[attr]);
		}

		return updates;
	}
}

export default Repository;
