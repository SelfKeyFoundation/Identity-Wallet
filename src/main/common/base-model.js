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

	$parseJson(json, opt) {
		Object.keys(json).forEach(key => {
			if (
				!(key in this.constructor.jsonSchema.properties) &&
				!(key in this.constructor.relationMappings)
			) {
				delete json[key];
			}
		});

		return super.$parseJson(json, opt);
	}

	static relationMappings() {
		return {};
	}

	static insertMany(records, tx) {
		const insertFn = (record, tx) => this.query(tx).insertAndFetch(record);
		return this.queryMany(records, insertFn, tx);
	}

	static updateMany(records, tx) {
		const updateFn = (record, tx) =>
			this.query(tx).patchAndFetchById(record[this.idColumn], record);
		return this.queryMany(records, updateFn, tx);
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
