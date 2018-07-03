const _ = require('lodash');
const { knex, sqlUtil } = require('../services/knex');
const { genRandId } = require('../../utils/crypto');
const Document = require('./document');
const WalletSetting = require('./wallet-setting');
const TABLE_NAME = 'id_attributes';

function getIdAttributeItemValue(idAttribute, itemId, valueId) {
	let item = _.find(idAttribute.items, { id: itemId });
	let value = null;
	if (item && item.values && item.values.length) {
		value = _.find(item.values, { id: valueId });
	}
	return value;
}

function generateIdAttributeObject(walletId, idAttributeType, staticData, document) {
	const ts = Date.now();
	let item = {
		walletId: walletId,
		idAttributeType: idAttributeType,
		items: [],
		createdAt: ts
	};

	item.items.push({
		id: genRandId(),
		name: null,
		isVerified: 0,
		order: 0,
		createdAt: ts,
		updatedAt: null,
		values: [
			{
				id: genRandId(),
				staticData: staticData ? staticData : {},
				documentId: document ? document.id : null,
				documentName: document ? document.name : null,
				order: 0,
				createdAt: ts,
				updatedAt: null
			}
		]
	});

	return item;
}

function generateEmptyIdAttributeObject(walletId, idAttributeType) {
	let item = {
		walletId: walletId,
		idAttributeType: idAttributeType,
		items: [],
		createdAt: Date.now()
	};
	return item;
}

function generateEmptyIdAttributeItemObject(name) {
	let item = {
		id: genRandId(),
		name: name ? name : null,
		isVerified: 0,
		order: 0,
		createdAt: Date.now(),
		updatedAt: null,
		values: []
	};
	return item;
}

function generateEmptyIdAttributeItemValueObject() {
	let item = {
		id: genRandId(),
		staticData: {},
		documentId: null,
		documentName: null,
		order: 0,
		createdAt: Date.now(),
		updatedAt: null
	};
	return item;
}

module.exports = {
	TABLE_NAME,
	create: (walletId, idAttributeType, staticData, file) =>
		knex.transaction(async trx => {
			let rows = await sqlUtil.select(TABLE_NAME, '*', { walletId, idAttributeType }, trx);
			if (rows && rows.length) {
				throw { message: 'id_attribute_already_exists' };
			}
			await sqlUtil.select(TABLE_NAME, '*', { walletId, idAttributeType }, trx);
			if (rows && rows.length) {
				throw { message: 'id_attribute_already_exists' };
			}
			let idAttribute = null;
			let document = null;
			if (file) {
				delete file.path;
				document = await Document.create(file, trx);
			}
			idAttribute = generateIdAttributeObject(
				walletId,
				idAttributeType,
				staticData,
				document
			);
			idAttribute.items = JSON.stringify(idAttribute.items);
			try {
				idAttribute = await sqlUtil.insertAndSelect(idAttribute, trx);
				idAttribute.items = JSON.parse(idAttribute.items);
			} catch (error) {
				throw {
					message: 'id_attribute_create_error',
					error: error
				};
			}
			return idAttribute;
		}),
	addEditDocumentToIdAttributeItemValue: (
		idAttributeId,
		idAttributeItemId,
		idAttributeItemValueId,
		file
	) =>
		knex.transaction(async trx => {
			let document = {
				buffer: file.buffer,
				name: file.name,
				mimeType: file.mimeType,
				size: file.size,
				createdAt: Date.now()
			};
			let idAttribute = await sqlUtil.selectOneById(TABLE_NAME, '*', idAttributeId, trx);
			if (!idAttribute) {
				throw { message: 'id_attribute_not_found' };
			}
			idAttribute.items = JSON.parse(idAttribute.items);

			// delete old document if exists (TODO JUST UPDATE IT)
			let value = getIdAttributeItemValue(
				idAttribute,
				idAttributeItemId,
				idAttributeItemValueId
			);
			if (value) {
				await Document.delete(value.documentId, trx);
			}

			let insertedDocument = await Document.create(document, trx);
			value.documentId = insertedDocument.id;
			value.documentName = insertedDocument.name;

			idAttribute.items = JSON.stringify(idAttribute.items);
			let updatedIdAttribute = await sqlUtil.updateById(TABLE_NAME, id, idAttribute, trx);
			updatedIdAttribute.items = JSON.parse(updatedIdAttribute.items);
			return updatedIdAttribute;
		}),
	addEditStaticDataToIdAttributeItemValue: (
		idAttributeId,
		idAttributeItemId,
		idAttributeItemValueId,
		staticData
	) =>
		knex.transaction(async trx => {
			let idAttribute = await sqlUtil.selectOneById(TABLE_NAME, '*', idAttributeId, trx);
			if (!idAttribute) {
				throw { message: 'id_attribute_not_found' };
			}
			idAttribute.items = JSON.parse(idAttribute.items);

			let value = getIdAttributeItemValue(
				idAttribute,
				idAttributeItemId,
				idAttributeItemValueId
			);

			value.staticData = staticData;

			idAttribute.items = JSON.stringify(idAttribute.items);
			try {
				idAttribite = await sqlUtil.updateById(
					TABLE_NAME,
					idAttribute.id,
					idAttribute,
					trx
				);
				idAttribute.items = JSON.parse(idAttribute.items);
				return idAttribute;
			} catch (error) {
				throw { message: 'update_error', error: error };
			}
		}),

	findAllByWalletId: async (walletId, tx) => {
		try {
			let rows = await sqlUtil.select(TABLE_NAME, '*', { walletId }, tx);
			if (!rows || !rows.length) {
				return [];
			}

			let idAttributes = rows.reduce((acc, attr) => {
				if (_.find(acc, { idAttributeType: attr.idAttributeType })) {
					return acc;
				}
				attr.items = JSON.parse(attr.items);
				acc[attr.id] = attr;
				return acc;
			}, {});
			console.log(idAttributes);
			return idAttributes;
		} catch (error) {
			throw { message: 'error_while_selecting', error: error };
		}
	},
	delete: (idAttributeId, idAttributeItemId, idAttributeItemValueId) =>
		knex.transaction(async trx => {
			let idAttribute = await sqlUtil.selectOneById(TABLE_NAME, '*', idAttributeId, trx);
			let value = getIdAttributeItemValue(
				idAttribute,
				idAttributeItemId,
				idAttributeItemValueId
			);
			if (value && value.documentId) {
				await Document.delete(value.documentId, trx);
			}
			await sqlUtil.delete(TABLE_NAME, { id: idAttribute.id }, trx);
			return idAttribute;
		}),
	addImportedIdAttributes: (walletId, exportCode, requiredDocuments, requiredStaticData) =>
		knex.transaction(async trx => {
			let walletSetting = await WalletSetting.findByWalletId(walletId);

			let idAttributesSavePromises = [];
			let documentsSavePromises = [];

			let itemsToSave = {};

			for (let i in requiredDocuments) {
				let requirement = requiredDocuments[i];
				if (!requirement.attributeType) continue;

				let idAttribute = generateEmptyIdAttributeObject(
					walletId,
					requirement.attributeType
				);
				idAttribute.tempId = genRandId();

				for (let j in requirement.docs) {
					let fileItems = requirement.docs[j].fileItems;
					let idAttributeItem = generateEmptyIdAttributeItemObject();
					idAttribute.items.push(idAttributeItem);

					for (let k in fileItems) {
						let fileItem = fileItems[k];
						let idAttributeItemValue = generateEmptyIdAttributeItemValueObject();
						idAttributeItem.values.push(idAttributeItemValue);

						let document = {
							name: fileItem.name,
							mimeType: fileItem.mimeType,
							size: fileItem.size,
							buffer: fileItem.buffer,
							createdAt: Date.now()
						};

						documentsSavePromises.push(
							Document.create(document, trx)
								.then(document => {
									idAttributeItemValue.documentId = document.id;
									idAttributeItemValue.documentName = document.name;
									itemsToSave[idAttribute.tempId] = idAttribute;
								})
								.catch(error => {
									console.log(error);
								})
						);
					}
				}
			}

			for (let i in requiredStaticData) {
				let requirement = requiredStaticData[i];
				if (!requirement.attributeType) continue;

				let staticData = {};
				for (let j in requirement.staticDatas) {
					let answer = requirement.staticDatas[j];
					staticData['line' + (parseInt(j) + 1).toString()] = answer;
				}

				let idAttribute = generateIdAttributeObject(
					walletId,
					requirement.attributeType,
					staticData,
					null
				);
				idAttribute.tempId = genRandId();

				itemsToSave[idAttribute.tempId] = idAttribute;
			}

			walletSetting.airDropCode = exportCode;

			await Promise.all(documentsSavePromises);

			for (let i in itemsToSave) {
				(function() {
					delete itemsToSave[i].tempId;
					itemsToSave[i].items = JSON.stringify(itemsToSave[i].items);
					idAttributesSavePromises.push(
						sqlUtil.insertAndSelect(TABLE_NAME, itemsToSave[i], trx)
					);
				})(i);
			}

			await Promise.all(idAttributesSavePromises);
			try {
				await WalletSetting.updateById(walletSetting.id, walletSetting, trx);
				return walletSetting;
			} catch (error) {
				console.log(error);
				throw { message: 'wallets_insert_error', error: error };
			}
		})
};
