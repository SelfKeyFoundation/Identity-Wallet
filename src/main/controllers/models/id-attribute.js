const electron = require('electron');
const Promise = require('bluebird');

module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'id_attributes';
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
	function _create(walletId, idAttributeType, staticData, file) {
		return knex.transaction(trx => {
			let selectPromise = sqlLiteService.select(
				TABLE_NAME,
				'*',
				{ walletId: walletId, idAttributeType: idAttributeType },
				trx
			);
			selectPromise
				.then(rows => {
					return new Promise((resolve, reject) => {
						if (rows && rows.length) {
							return reject({ message: 'id_attribute_already_exists' });
						}

						let idAttribute = null;

						if (file) {
							file.createdAt = new Date().getTime();
							delete file.path;
							let insertDocumentPromise = sqlLiteService.insertAndSelect(
								'documents',
								file,
								trx
							);
							insertDocumentPromise
								.then(document => {
									idAttribute = helpers.generateIdAttributeObject(
										walletId,
										idAttributeType,
										staticData,
										document
									);
									idAttribute.items = JSON.stringify(idAttribute.items);

									__insert(idAttribute, trx)
										.then(idAttribute => {
											resolve(idAttribute);
										})
										.catch(error => {
											reject({
												message: 'id_attribute_create_error',
												error: error
											});
										});
								})
								.catch(error => {
									reject({ message: 'id_attribute_create_error', error: error });
								});
						} else {
							idAttribute = helpers.generateIdAttributeObject(
								walletId,
								idAttributeType,
								staticData,
								null
							);
							idAttribute.items = JSON.stringify(idAttribute.items);
							__insert(idAttribute, trx)
								.then(idAttribute => {
									resolve(idAttribute);
								})
								.catch(error => {
									reject({ message: 'id_attribute_create_error', error: error });
								});
						}
					});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		});
	}

	// DONE !!!!!
	function _addEditDocumentToIdAttributeItemValue(
		idAttributeId,
		idAttributeItemId,
		idAttributeItemValueId,
		file
	) {
		return knex.transaction(trx => {
			let document = {
				buffer: file.buffer,
				name: file.name,
				mimeType: file.mimeType,
				size: file.size,
				createdAt: new Date().getTime()
			};

			let selectPromise = sqlLiteService.select(TABLE_NAME, '*', { id: idAttributeId }, trx);
			selectPromise
				.then(rows => {
					return new Promise((resolve, reject) => {
						if (!rows || !rows.length) {
							return reject({ message: 'id_attribute_not_found' });
						}

						let idAttribute = rows[0];
						idAttribute.items = JSON.parse(idAttribute.items);

						// delete old document if exists (TODO JUST UPDATE IT)
						let item = helpers.getRecordById(idAttribute.items, idAttributeItemId);
						let value = null;
						if (item && item.values && item.values.length) {
							value = helpers.getRecordById(item.values, idAttributeItemValueId);
							if (value && value.documentId) {
								knex('documents')
									.where({ id: value.documentId })
									.del();
							}
						}

						let insertDocumentPromise = sqlLiteService.insertAndSelect(
							'documents',
							document,
							trx
						);
						insertDocumentPromise
							.then(document => {
								value.documentId = document.id;
								value.documentName = document.name;

								idAttribute.items = JSON.stringify(idAttribute.items);

								let updatePromise = knex(TABLE_NAME)
									.transacting(trx)
									.update(idAttribute)
									.where({ id: idAttribute.id });
								updatePromise
									.then(rows => {
										idAttribute.items = JSON.parse(idAttribute.items);
										resolve(idAttribute);
									})
									.catch(error => {
										reject({ message: 'update_error', error: error });
									});
							})
							.catch(error => {
								reject({ message: 'insert_error', error: error });
							});
					});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		});
	}

	// DONE !!!!!
	function _addEditStaticDataToIdAttributeItemValue(
		idAttributeId,
		idAttributeItemId,
		idAttributeItemValueId,
		staticData
	) {
		return knex.transaction(trx => {
			let selectPromise = sqlLiteService.select(TABLE_NAME, '*', { id: idAttributeId }, trx);
			selectPromise
				.then(rows => {
					return new Promise((resolve, reject) => {
						if (!rows || !rows.length) {
							return reject({ message: 'id_attribute_not_found' });
						}

						let idAttribute = rows[0];
						idAttribute.items = JSON.parse(idAttribute.items);

						let value = helpers.getIdAttributeItemValue(
							idAttribute,
							idAttributeItemId,
							idAttributeItemValueId
						);

						value.staticData = staticData;

						idAttribute.items = JSON.stringify(idAttribute.items);
						idAttribute.updatedAt = new Date().getTime();

						let updatePromise = knex(TABLE_NAME)
							.transacting(trx)
							.update(idAttribute)
							.where({ id: idAttribute.id });
						updatePromise
							.then(rows => {
								idAttribute.items = JSON.parse(idAttribute.items);
								resolve(idAttribute);
							})
							.catch(error => {
								reject({ message: 'update_error', error: error });
							});
					});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		});
	}

	// DONE !!!!!
	function _findAllByWalletId(walletId) {
		return new Promise((resolve, reject) => {
			knex(TABLE_NAME)
				.select()
				.where('walletId', walletId)
				.then(rows => {
					if (!rows || !rows.length) {
						return resolve([]);
					}

					let idAttributes = {};

					for (let i in rows) {
						let idAttribute = rows[i];

						if (!idAttribute) continue;

						if (temp__checkType(idAttributes, idAttribute.idAttributeType)) {
							continue;
						}

						idAttribute.items = JSON.parse(idAttribute.items);

						idAttributes[idAttribute.id] = idAttribute;
					}

					resolve(idAttributes);
				})
				.catch(error => {
					reject({ message: 'error_while_selecting', error: error });
				});
		});
	}

	// DONE !!!!!
	function _delete(idAttributeId, idAttributeItemId, idAttributeItemValueId) {
		console.log(idAttributeId, idAttributeItemId, idAttributeItemValueId);
		return knex.transaction(trx => {
			let selectPromise = knex(TABLE_NAME)
				.transacting(trx)
				.select()
				.where('id', idAttributeId);
			selectPromise
				.then(rows => {
					return new Promise((resolve, reject) => {
						let idAttribute = rows[0];

						let promises = [];

						let value = helpers.getIdAttributeItemValue(
							idAttribute,
							idAttributeItemId,
							idAttributeItemValueId
						);
						if (value && value.documentId) {
							promises.push(
								knex('documents')
									.transacting(trx)
									.del()
									.where('id', value.documentId)
							);
						}

						promises.push(
							knex('id_attributes')
								.transacting(trx)
								.del()
								.where('id', idAttribute.id)
						);

						Promise.all(promises)
							.then(responses => {
								resolve();
							})
							.catch(error => {
								reject();
							});
					});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		});
	}

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
											.insertIntoTable('documents', document, trx)
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
											sqlLiteService.insertIntoTable(
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
												reject({
													message: 'wallets_insert_error',
													error: error
												});
											});
									})
									.catch(error => {
										console.log(error);
										reject({ message: 'wallets_insert_error', error: error });
									});
							})
							.catch(error => {
								console.log(error);
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
								idAttribute.items = items ? items : [];

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
									reject({ message: 'error_while_selecting', error: error });
								});
						})
						.catch(error => {
							reject({ message: 'error_while_selecting', error: error });
						});
				})
				.catch(error => {
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
					reject({ message: 'error_while_selecting', error: error });
				});
		});
	}

	function temp__checkType(idAttributes, idAttributeType) {
		for (let i in idAttributes) {
			if (idAttributes[i].idAttributeType === idAttributeType) {
				return true;
			}
		}
		return false;
	}

	function __insert(idAttribute, trx) {
		return sqlLiteService.insertAndSelect(TABLE_NAME, idAttribute, trx);
	}

	return Controller;
};
