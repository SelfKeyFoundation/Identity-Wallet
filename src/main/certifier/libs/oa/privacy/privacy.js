'use strict';
var __assign =
	(this && this.__assign) ||
	function() {
		__assign =
			Object.assign ||
			function(t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i];
					for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
				}
				return t;
			};
		return __assign.apply(this, arguments);
	};
Object.defineProperty(exports, '__esModule', { value: true });
var lodash_1 = require('lodash');
var flatten_1 = require('../serialize/flatten');
var utils_1 = require('../utils');
var salt_1 = require('./salt');
exports.getData = function(document) {
	return salt_1.unsaltData(document.data);
};
/**
 * Takes a partial originating document, possibly only with a schema.id and returns a document with the given data and obfuscated data
 * @param document the metadata container
 * @param data the data
 * @param obfuscatedData hashes of replaced data to put into the privacy field
 */
// TODO: split into two separate functions for the two different use cases
exports.setData = function(document, data, obfuscatedData) {
	if (obfuscatedData === void 0) {
		obfuscatedData = [];
	}
	var privacy = __assign({}, document.privacy, {
		obfuscatedData: obfuscatedData && obfuscatedData.length > 0 ? obfuscatedData : []
	});
	return __assign({}, document, { data: data, privacy: privacy });
};
exports.obfuscateData = function(_data, fields) {
	var data = lodash_1.cloneDeep(_data); // Prevents alteration of original data
	var fieldsToRemove = Array.isArray(fields) ? fields : [fields];
	// Obfuscate data by hashing them with the key
	var dataToObfuscate = flatten_1.flatten(lodash_1.pick(data, fieldsToRemove));
	var obfuscatedData = Object.keys(dataToObfuscate).map(function(k) {
		var obj = {};
		obj[k] = dataToObfuscate[k];
		return utils_1.toBuffer(obj).toString('hex');
	});
	// Return remaining data
	fieldsToRemove.forEach(function(path) {
		lodash_1.unset(data, path);
	});
	return {
		data: data,
		obfuscatedData: obfuscatedData
	};
};
exports.obfuscateDocument = function(document, fields) {
	var existingData = document.data;
	var _a = exports.obfuscateData(existingData, fields),
		data = _a.data,
		obfuscatedData = _a.obfuscatedData;
	// we use lodash.get because document might not have the correct fields when coming from external input
	var currentObfuscatedData = lodash_1.get(document, 'privacy.obfuscatedData', []);
	var newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
	return exports.setData(document, data, newObfuscatedData);
};
