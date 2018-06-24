'use strict';

const crypto = require('crypto');
const fs = require('fs');

module.exports = function(app) {
	let controller = {};

	controller.copyFile = function(source, target, cb) {
		var cbCalled = false;

		var rd = fs.createReadStream(source);
		rd.on('error', function(err) {
			done(err);
		});
		var wr = fs.createWriteStream(target);
		wr.on('error', function(err) {
			done(err);
		});
		wr.on('close', function(ex) {
			done();
		});
		rd.pipe(wr);

		function done(err) {
			if (!cbCalled) {
				cb(err);
				cbCalled = true;
			}
		}
	};

	// TODO
	controller.moveFile = function(source, target, cb) {
		/*
        mv(args.src, args.dest, (err) => {
            win.webContents.send('MOVE_FILE', err);
        });
        */
	};

	controller.getJavaVersion = function(callback) {
		let spawn = require('child_process').spawn('java', ['-version']);

		spawn.on('error', function(err) {
			callback(null);
		});

		spawn.stderr.on('data', function(data) {
			data = data.toString().split('\n')[0];
			var javaVersion = new RegExp('java version').test(data)
				? data.split(' ')[2].replace(/"/g, '')
				: false;
			if (javaVersion != false) {
				callback(javaVersion);
			} else {
				callback(null);
			}
		});
	};

	controller.generateId = _generateId;
	controller.getRecordById = _getRecordById;
	controller.getIdAttributeItemValue = _getIdAttributeItemValue;
	controller.generateIdAttributeObject = _generateIdAttributeObject;
	controller.generateEmptyIdAttributeObject = _generateEmptyIdAttributeObject;
	controller.generateEmptyIdAttributeItemObject = _generateEmptyIdAttributeItemObject;
	controller.generateEmptyIdAttributeItemValueObject = _generateEmptyIdAttributeItemValueObject;

	function _generateId() {
		return crypto.randomBytes(12).toString('hex');
	}

	function _getIdAttributeItemValue(idAttribute, itemId, valueId) {
		let item = _getRecordById(idAttribute.items, itemId);
		let value = null;
		if (item && item.values && item.values.length) {
			value = _getRecordById(item.values, valueId);
		}
		return value;
	}

	function _getRecordById(items, id) {
		for (let i in items) {
			if (items[i].id === id) {
				return items[i];
			}
		}
		return null;
	}

	function _generateIdAttributeObject(walletId, idAttributeType, staticData, document) {
		let item = {
			walletId: walletId,
			idAttributeType: idAttributeType,
			items: [],
			createdAt: new Date().getTime()
		};

		item.items.push({
			id: _generateId(),
			name: null,
			isVerified: 0,
			order: 0,
			createdAt: new Date().getTime(),
			updatedAt: null,
			values: [
				{
					id: _generateId(),
					staticData: staticData ? staticData : {},
					documentId: document ? document.id : null,
					documentName: document ? document.name : null,
					order: 0,
					createdAt: new Date().getTime(),
					updatedAt: null
				}
			]
		});

		return item;
	}

	function _generateEmptyIdAttributeObject(walletId, idAttributeType) {
		let item = {
			walletId: walletId,
			idAttributeType: idAttributeType,
			items: [],
			createdAt: new Date().getTime()
		};
		return item;
	}

	function _generateEmptyIdAttributeItemObject(name) {
		let item = {
			id: _generateId(),
			name: name ? name : null,
			isVerified: 0,
			order: 0,
			createdAt: new Date().getTime(),
			updatedAt: null,
			values: []
		};
		return item;
	}

	function _generateEmptyIdAttributeItemValueObject() {
		let item = {
			id: _generateId(),
			staticData: {},
			documentId: null,
			documentName: null,
			order: 0,
			createdAt: new Date().getTime(),
			updatedAt: null
		};
		return item;
	}

	return controller;
};
