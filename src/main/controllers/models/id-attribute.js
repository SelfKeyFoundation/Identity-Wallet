const { knex, sqlUtil } = require('../../services/knex');
const { genRandId } = require('../../utils/crypto');
const Document = require('./document');
const TABLE_NAME = 'id_attributes';

function getIdAttributeItemValue(idAttribute, itemId, valueId) {
	let item = _.find(idAttribute.items, { id: itemId });
	let value = null;
	if (item && item.values && item.values.length) {
		value = _.find(item.values, { id: valueId });
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

const findById = (items, _id) => _.find(idAttribute.items, ({ id }) => id === idAttributeItemId);

module.exports = {
	TABLE_NAME,
	findById: (id, tx) => {},
	create: (walletId, idAttributeType, staticData, file) =>
		knex.transaction(async trx => {
			try {
				let rows = await sqlUtil.select(
					TABLE_NAME,
					'*',
					{ walletId, idAttributeType },
					trx
				);
				if (rows && rows.length) {
					throw { message: 'id_attribute_already_exists' };
				}
				let rows = await sqlUtil.select(
					TABLE_NAME,
					'*',
					{ walletId, idAttributeType },
					trx
				);
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
				} catch (error) {
					throw {
						message: 'id_attribute_create_error',
						error: error
					};
				}
				return trx.commit(idAttribute);
			} catch (error) {
				return trx.rollback(error);
			}
		}),
	addEditDocumentToIdAttributeItemValue: (
		idAttributeId,
		idAttributeItemId,
		idAttributeItemValueId,
		file
	) =>
		knex.transaction(async trx => {
			try {
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

				return trx.commit(updatedIdAttribute);
			} catch (error) {
				return trx.rollback(error);
			}
		}),
	addEditStaticDataToIdAttributeItemValue: (
		idAttributeId,
		idAttributeItemId,
		idAttributeItemValueId,
		staticData
	) =>
		knex.transaction(async trx => {
			try {
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
					return trx.commit(idAttribute);
				} catch (error) {
					throw { message: 'update_error', error: error };
				}
			} catch (error) {
				return trx.rollback(error);
			}
		}),
	findAllByWalletId: async (walletId, tx) => {
		try {
			let rows = await sqlUtil.select(TABLE_NAME, '*', { walletId }, tx);
			if (!rows || !rows.length) {
				return [];
			}

			let idAttributes = rows.reduce(
				acc,
				attr => {
					if (_.find(acc, { idAttributeType: attr.idAttributeType })) {
						return acc;
					}
					attr.items = JSON.parse(attr.items);
					acc[attr.id] = attr;
					return acc;
				},
				{}
			);

			return idAttributes;
		} catch (error) {
			throw { message: 'error_while_selecting', error: error };
		}
	},
	delete: (idAttributeId, idAttributeItemId, idAttributeItemValueId) =>
		knex.transaction(async trx => {
			try {
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
				return trx.commit();
			} catch (error) {
				return trx.rollback(error);
			}
		}),
	addImportedIdAttributes: () => {}
};

module.exports = function(app, sqlLiteService) {
	const Controller = function() {};

	let knex = sqlLiteService.knex;
	let helpers = electron.app.helpers;

	Controller.selectById = selectById;
	Controller.create = _create;

	Controller.addEditDocumentToIdAttributeItemValue = _addEditDocumentToIdAttributeItemValue;
	Controller.addEditStaticDataToIdAttributeItemValue = _addEditStaticDataToIdAttributeItemValue;

	Controller.delete = _delete;

	Controller.findAllByWalletId = _findAllByWalletId;
	Controller.addImportedIdAttributes = _addImportedIdAttributes;

	// DONE !!!!!
	function _addImportedIdAttributes(walletId, exportCode, requiredDocuments, requiredStaticData) {
		return knex.transaction(trx => {
			sqlLiteService
				.select('wallet_settings', '*', { walletId: walletId }, trx)
				.then(rows => {
					return new Promise((resolve, reject) => {
						let walletSetting = rows[0];

						let idAttributesSavePromises = [];
						let documentsSavePromises = [];

						let itemsToSave = {};

						for (let i in requiredDocuments) {
							let requirement = requiredDocuments[i];
							if (!requirement.attributeType) continue;

							let idAttribute = helpers.generateEmptyIdAttributeObject(
								walletId,
								requirement.attributeType
							);
							idAttribute.tempId = helpers.generateId();

							for (let j in requirement.docs) {
								let fileItems = requirement.docs[j].fileItems;
								let idAttributeItem = helpers.generateEmptyIdAttributeItemObject();
								idAttribute.items.push(idAttributeItem);

								for (let k in fileItems) {
									let fileItem = fileItems[k];
									let idAttributeItemValue = helpers.generateEmptyIdAttributeItemValueObject();
									idAttributeItem.values.push(idAttributeItemValue);

									let document = {
										name: fileItem.name,
										mimeType: fileItem.mimeType,
										size: fileItem.size,
										buffer: fileItem.buffer,
										createdAt: new Date().getTime()
									};

									documentsSavePromises.push(
										sqlLiteService
											.insertAndSelect('documents', document, trx)
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

							let idAttribute = helpers.generateIdAttributeObject(
								walletId,
								requirement.attributeType,
								staticData,
								null
							);
							idAttribute.tempId = helpers.generateId();

							itemsToSave[idAttribute.tempId] = idAttribute;
						}

						walletSetting.airDropCode = exportCode;

						Promise.all(documentsSavePromises)
							.then(() => {
								for (let i in itemsToSave) {
									(function() {
										delete itemsToSave[i].tempId;
										itemsToSave[i].items = JSON.stringify(itemsToSave[i].items);
										idAttributesSavePromises.push(
											sqlLiteService.insertAndSelect(
												'id_attributes',
												itemsToSave[i],
												trx
											)
										);
									})(i);
								}

								Promise.all(idAttributesSavePromises)
									.then(() => {
										sqlLiteService
											.update(
												'wallet_settings',
												walletSetting,
												{ id: walletSetting.id },
												trx
											)
											.then(() => {
												resolve(walletSetting);
											})
											.catch(error => {
												console.log(error);
												// eslint-disable-next-line prefer-promise-reject-errors
												reject({
													message: 'wallets_insert_error',
													error: error
												});
											});
									})
									.catch(error => {
										console.log(error);
										// eslint-disable-next-line prefer-promise-reject-errors
										reject({ message: 'wallets_insert_error', error: error });
									});
							})
							.catch(error => {
								console.log(error);
								// eslint-disable-next-line prefer-promise-reject-errors
								reject({ message: 'wallets_insert_error', error: error });
							});
					});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		});
	}

	function selectById(id, trx) {
		return new Promise((resolve, reject) => {
			let selectQuery = sqlLiteService.select(TABLE_NAME, '*', { id: id }, trx);
			selectQuery
				.then(rows => {
					if (!rows || !rows.length) {
						// eslint-disable-next-line prefer-promise-reject-errors
						return reject({ message: 'not_found' });
					}

					let idAttribute = null;

					let idAttributeItemPromises = [];
					let idAttributeItemValuesPromises = [];

					idAttribute = rows[0];

					idAttributeItemPromises.push(
						sqlLiteService
							.select(
								'id_attribute_items',
								'*',
								{ idAttributeId: idAttribute.id },
								trx
							)
							.then(items => {
								idAttribute.items = items || [];

								for (let j in items) {
									idAttributeItemValuesPromises.push(
										selectIdAttributeItemValueView(
											{ idAttributeItemId: items[j].id },
											trx
										).then(values => {
											if (values) {
												for (let i in values) {
													if (values[i].staticData) {
														values[i].staticData = JSON.parse(
															values[i].staticData
														);
													}
												}
												items[j].values = values;
											} else {
												items[j].values = [];
											}
										})
									);
								}
							})
					);

					Promise.all(idAttributeItemPromises)
						.then(items => {
							Promise.all(idAttributeItemValuesPromises)
								.then(values => {
									resolve(idAttribute);
								})
								.catch(error => {
									// eslint-disable-next-line prefer-promise-reject-errors
									reject({ message: 'error_while_selecting', error: error });
								});
						})
						.catch(error => {
							// eslint-disable-next-line prefer-promise-reject-errors
							reject({ message: 'error_while_selecting', error: error });
						});
				})
				.catch(error => {
					// eslint-disable-next-line prefer-promise-reject-errors
					reject({ message: 'error_while_selecting', error: error });
				});
		});
	}

	function selectIdAttributeItemValueView(where, trx) {
		return new Promise((resolve, reject) => {
			let query = knex('id_attribute_item_values');

			if (trx) {
				query = query.transacting(trx);
			}

			let promise = query
				.select(
					'id_attribute_item_values.*',
					'documents.name as documentFileName',
					'id_attribute_items.id as idAttributeItemId',
					'id_attributes.id as idAttributeId',
					'id_attributes.idAttributeType',
					'id_attributes.walletId'
				)
				.leftJoin(
					'id_attribute_items',
					'id_attribute_item_values.idAttributeItemId',
					'id_attribute_items.id'
				)
				.leftJoin('id_attributes', 'id_attribute_items.idAttributeId', 'id_attributes.id')
				.leftJoin('documents', 'id_attribute_item_values.documentId', 'documents.id')
				.where(where);

			promise
				.then(rows => {
					resolve(rows);
				})
				.catch(error => {
					// eslint-disable-next-line prefer-promise-reject-errors
					reject({ message: 'error_while_selecting', error: error });
				});
		});
	}

	function __insert(idAttribute, trx) {
		return sqlLiteService.insertAndSelect(TABLE_NAME, idAttribute, trx);
	}

	return Controller;
};
