import { Model, transaction } from 'objection';
import { Logger } from 'common/logger';

const log = new Logger('BaseModel');

export class BaseModel extends Model {
	$beforeInsert() {
		const ts = Date.now();
		this.createdAt = ts;
		this.updatedAt = ts;
	}
	$beforeUpdate() {
		this.updatedAt = Date.now();
	}

	isPropertyType(key, type) {
		let properties = this.constructor.jsonSchema ? this.constructor.jsonSchema.properties : {};
		if (!properties[key]) return false;
		let propType = properties[key].type || '';
		if (Array.isArray(propType)) return propType.includes(type);
		return type === propType;
	}

	$parseJson(json, opt) {
		json = { ...json };
		let properties = this.constructor.jsonSchema ? this.constructor.jsonSchema.properties : {};
		let relations = this.constructor.relationMappings || {};
		Object.keys(json).forEach(key => {
			// delete any field not in schema or relations
			if (!(key in properties) && !(key in relations)) {
				delete json[key];
			}
			// convert numeric fields to boolean if defined as boolean in schema
			if (key in json && this.isPropertyType(key, 'boolean')) {
				json[key] = !!json[key];
			}
		});

		return super.$parseJson(json, opt);
	}

	$parseDatabaseJson(db) {
		let json = super.$parseDatabaseJson(db);
		for (let prop in json) {
			// convert numeric fields in database to boolean if defined as boolean
			// in schema
			if (this.isPropertyType(prop, 'boolean')) {
				json[prop] = !!json[prop];
			}
		}

		return json;
	}

	static relationMappings() {
		return {};
	}

	static insertMany(records, tx, hideErrors = false) {
		records = records.filter(r => !!r);
		const insertFn = async (record, tx) => {
			try {
				const res = await this.query(tx).insertAndFetch(record);
				return res;
			} catch (error) {
				log.error('Error inserting %2j', record);
				log.error(error);
				if (!hideErrors) throw error;
			}
		};
		return this.queryMany(records, insertFn, tx);
	}

	static updateMany(records, tx, hideErrors = false) {
		const updateFn = async (record, tx) => {
			try {
				const res = await this.query(tx).patchAndFetchById(record[this.idColumn], record);
				return res;
			} catch (error) {
				log.error(error);
				log.error('Error update %s %s %s', record.env, record.vendorId, record.sku);
				if (!hideErrors) throw error;
			}
		};
		return this.queryMany(records, updateFn, tx);
	}

	static deleteMany(ids, tx) {
		return this.query(tx)
			.whereIn(this.idColumn, ids)
			.del();
	}

	static async queryMany(records, queryFn, externalTx) {
		const tx = externalTx || (await transaction.start(this.knex()));
		try {
			let results = await Promise.all(records.map(r => queryFn(r, tx)));
			if (!externalTx) await tx.commit();
			return results;
		} catch (error) {
			if (!externalTx) await tx.rollback();
			throw error;
		}
	}
}

export default BaseModel;
