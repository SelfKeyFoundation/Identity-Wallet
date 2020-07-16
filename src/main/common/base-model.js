import { Model, transaction } from 'objection';

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

	static insertMany(records, tx) {
		records = records.filter(r => !!r);
		const insertFn = (record, tx) => this.query(tx).insertAndFetch(record);
		return this.queryMany(records, insertFn, tx);
	}

	static updateMany(records, tx) {
		const updateFn = (record, tx) =>
			this.query(tx).patchAndFetchById(record[this.idColumn], record);
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
