const { Model, transaction } = require('objection');

class BaseModel extends Model {
	$beforeInsert() {
		const ts = Date.now();
		this.createdAt = ts;
		this.updatedAt = ts;
	}
	$beforeUpdate() {
		this.updatedAt = Date.now();
	}

	static insertMany(records) {
		const insertFn = (record, tx) => this.query(tx).insertAndFetch(record);
		return this.queryMany(records, insertFn);
	}

	static updateMany(records, whereFn) {
		const updateFn = (record, tx) =>
			this.query(tx)
				.patchAndFetch(record)
				.where(whereFn(record));
		return this.queryMany(records, updateFn);
	}

	static async queryMany(records, queryFn) {
		const tx = await transaction.start(this.knex());
		try {
			let results = await Promise.all(records.map(r => queryFn(r, tx)));
			await tx.commit();
			return results;
		} catch (error) {
			await tx.rollback();
			throw error;
		}
	}
}

module.exports = BaseModel;
