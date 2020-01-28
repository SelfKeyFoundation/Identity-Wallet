'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var digest_1 = require('./digest');
var schema_1 = require('./schema');
var signature_1 = require('./signature');
var privacy_1 = require('./privacy');
var salt_1 = require('./privacy/salt');
var utils = require('./utils');
exports.utils = utils;
var createDocument = function(data, schema) {
	var document = privacy_1.setData({ schema: schema.$id, data: null }, salt_1.saltData(data));
	var valid = schema_1.validate(document, schema);
	if (valid) {
		return document;
	}
	throw new Error('Invalid document:' + JSON.stringify(data, null, 2));
};
exports.issueDocument = function(data, schema) {
	var document = createDocument(data, schema);
	return signature_1.sign(document, [digest_1.digestDocument(document)]);
};
exports.issueDocuments = function(dataArray, schema) {
	var documents = dataArray.map(function(data) {
		return createDocument(data, schema);
	});
	var batchHashes = documents.map(digest_1.digestDocument);
	return documents.map(function(doc) {
		return signature_1.sign(doc, batchHashes);
	});
};
var digest_2 = require('./digest');
exports.digestDocument = digest_2.digestDocument;
var privacy_2 = require('./privacy');
exports.getData = privacy_2.getData;
exports.obfuscateDocument = privacy_2.obfuscateDocument;
var schema_2 = require('./schema');
exports.addSchema = schema_2.addSchema;
exports.validateSchema = schema_2.validate;
var signature_2 = require('./signature');
exports.checkProof = signature_2.checkProof;
exports.MerkleTree = signature_2.MerkleTree;
exports.sign = signature_2.sign;
exports.verifySignature = signature_2.verify;
