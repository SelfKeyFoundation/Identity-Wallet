'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var Ajv = require('ajv');
var privacy_1 = require('../privacy');
// We need to do this horrible thing because the return type of validate makes no sense
// https://github.com/epoberezkin/ajv/issues/911
var ajv = new Ajv();
exports.addSchema = function(schema) {
	try {
		ajv.addSchema(schema, schema.id);
	} catch (e) {
		// Ignore error if schema already exist
		if (!e.message.includes('already exists')) {
			throw e;
		}
	}
};
exports.validate = function(document, schema) {
	// TODO document.schema is set as mandatory here because for the moment it can't be made required in the interface
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	var result = schema
		? ajv.validate(schema, privacy_1.getData(document))
		: ajv.validate(document.schema, privacy_1.getData(document));
	// eslint-disable-next-line no-console
	// console.log(ajv.errors); // TODO: properly feedback error
	return result;
};
