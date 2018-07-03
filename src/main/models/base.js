const { Model } = require('objection');

class BaseModel extends Model {
	$beforeInsert() {
		this.createdAt = Date.now();
	}
	$beforeUpdate() {
		this.updatedAt = Date.now();
	}
}

module.exports = BaseModel;
