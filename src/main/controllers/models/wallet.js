const electron = require('electron');
const Promise = require('bluebird');

module.exports = function(app, sqlLiteService) {
	const TABLE_NAME = 'wallets';
	const Controller = function() {};

	let knex = sqlLiteService.knex;
	let helpers = electron.app.helpers;

	/**
	 *
	 */
	Controller.add = _add;
	Controller.addInitialIdAttributesAndActivate = _addInitialIdAttributesAndActivate;

	Controller.findActive = _findActive;
	Controller.findAll = _findAll;
	Controller.findByPublicKey = _findByPublicKey;

	Controller.selectProfilePictureById = _selectProfilePictureById;
	Controller.updateProfilePicture = _updateProfilePicture;

	Controller.editImportedIdAttributes = _editImportedIdAttributes;

	// DONE !!!!!
	function _addInitialIdAttributesAndActivate(walletId, initialIdAttributes) {
		return knex.transaction(trx => {
			sqlLiteService
				.select(TABLE_NAME, '*', { id: walletId }, trx)
				.then(rows => {
					let wallet = rows[0];

					return new Promise((resolve, reject) => {
						sqlLiteService
							.select('id_attribute_types', '*', { isInitial: 1 }, trx)
							.then(idAttributeTypes => {
								let idAttributesSavePromises = [];
								for (let i in idAttributeTypes) {
									let idAttributeType = idAttributeTypes[i];

									let item = {
										walletId: wallet.id,
										idAttributeType: idAttributeType.key,
										items: [],
										createdAt: new Date().getTime()
									};

									item.items.push({
										id: helpers.generateId(),
										name: null,
										isVerified: 0,
										order: 0,
										createdAt: new Date().getTime(),
										updatedAt: null,
										values: [
											{
												id: helpers.generateId(),
												staticData: {
													line1: initialIdAttributes[idAttributeType.key]
												},
												documentId: null,
												order: 0,
												createdAt: new Date().getTime(),
												updatedAt: null
											}
										]
									});

									item.items = JSON.stringify(item.items);

									// add initial id attributes
									idAttributesSavePromises.push(
										sqlLiteService
											.insertIntoTable('id_attributes', item, trx)
											.catch(error => {
												console.log(error);
											})
									);
								}

								Promise.all(idAttributesSavePromises)
									.then(() => {
										wallet.isSetupFinished = 1;

										sqlLiteService
											.update(TABLE_NAME, wallet, { id: wallet.id }, trx)
											.then(() => {
												resolve(wallet);
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

	function _add(data) {
		data.createdAt = new Date().getTime();
		return knex.transaction(trx => {
			knex(TABLE_NAME)
				.transacting(trx)
				.insert(data)
				.then(insertedIds => {
					let id = insertedIds[0];
					data.id = id;

					let promises = [];

					// add wallet settings
					promises.push(
						sqlLiteService.insertIntoTable(
							'wallet_settings',
							{
								walletId: id,
								sowDesktopNotifications: 1,
								createdAt: new Date().getTime()
							},
							trx
						)
					);

					// add wallet tokens
					promises.push(
						sqlLiteService.insertIntoTable(
							'wallet_tokens',
							{ walletId: id, tokenId: 1, createdAt: new Date().getTime() },
							trx
						)
					);

					return new Promise((resolve, reject) => {
						Promise.all(promises)
							.then(t => {
								resolve(data);
							})
							.catch(error => {
								reject({ message: 'wallet_init_error', error: error });
							});
					});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		});
	}

	// DONE
	function _editImportedIdAttributes(walletId, initialIdAttributes) {
		return knex.transaction(trx => {
			sqlLiteService
				.select(TABLE_NAME, '*', { id: walletId }, trx)
				.then(rows => {
					let wallet = rows[0];

					return new Promise((resolve, reject) => {
						sqlLiteService
							.select('id_attribute_types', '*', { isInitial: 1 }, trx)
							.then(idAttributeTypes => {
								let idAttributeTypesSelectPromises = [];
								let idAttributesSavePromises = [];

								let idAttributesToInsert = [];

								for (let i in idAttributeTypes) {
									let idAttributeType = idAttributeTypes[i];

									idAttributeTypesSelectPromises.push(
										sqlLiteService
											.select(
												'id_attributes',
												'*',
												{
													walletId: walletId,
													idAttributeType: idAttributeType.key
												},
												trx
											)
											.then(idAttributes => {
												let idAttribute = null;

												if (idAttributes && idAttributes.length === 1) {
													idAttribute = idAttributes[0];
													idAttribute.items = JSON.parse(
														idAttribute.items
													);
													if (initialIdAttributes[idAttributeType.key]) {
														idAttribute.items[0].values[0].staticData.line1 =
															initialIdAttributes[
																idAttributeType.key
															];
													}
													idAttribute.items = JSON.stringify(
														idAttribute.items
													);
												} else {
													idAttribute = {
														walletId: wallet.id,
														idAttributeType: idAttributeType.key,
														items: [],
														createdAt: new Date().getTime()
													};

													idAttribute.items.push({
														id: helpers.generateId(),
														name: null,
														isVerified: 0,
														order: 0,
														createdAt: new Date().getTime(),
														updatedAt: null,
														values: [
															{
																id: helpers.generateId(),
																staticData: {
																	line1:
																		initialIdAttributes[
																			idAttributeType.key
																		]
																},
																documentId: null,
																order: 0,
																createdAt: new Date().getTime(),
																updatedAt: null
															}
														]
													});
													idAttribute.items = JSON.stringify(
														idAttribute.items
													);
												}

												return idAttribute;
											})
									);
								}

								Promise.all(idAttributeTypesSelectPromises)
									.then(idAttributesList => {
										let finalPromises = [];

										for (let i in idAttributesList) {
											(function() {
												let idAttribute = idAttributesList[i];
												if (idAttribute.id) {
													finalPromises.push(
														sqlLiteService.update(
															'id_attributes',
															idAttribute,
															{ id: idAttribute.id },
															trx
														)
													);
												} else {
													finalPromises.push(
														sqlLiteService.insertIntoTable(
															'id_attributes',
															idAttribute,
															trx
														)
													);
												}
											})(i);
										}

										Promise.all(finalPromises)
											.then(results => {
												wallet.isSetupFinished = 1;
												sqlLiteService
													.update(
														'wallets',
														wallet,
														{ id: wallet.id },
														trx
													)
													.then(() => {
														resolve(wallet);
													})
													.catch(error => {
														reject({
															message: 'wallets_insert_error',
															error: error
														});
													});
											})
											.catch(error => {
												reject({
													message: 'wallets_insert_error',
													error: error
												});
											});
									})
									.catch(error => {
										reject({ message: 'wallets_insert_error', error: error });
									});
							})
							.catch(error => {
								reject({ message: 'wallets_insert_error', error: error });
							});
					});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		});
	}

	function _findActive() {
		return new Promise((resolve, reject) => {
			sqlLiteService
				.select(TABLE_NAME, '*', { isSetupFinished: 1 })
				.then(rows => {
					resolve(rows);
				})
				.catch(error => {
					reject({ message: 'wallet_findActive', error: error });
				});
		});
	}

	function _findAll() {
		return new Promise((resolve, reject) => {
			knex(TABLE_NAME)
				.select()
				.whereNotNull('keystoreFilePath')
				.then(rows => {
					resolve(rows);
				})
				.catch(error => {
					reject({ message: 'wallet_findAll', error: error });
				});
		});
	}

	function _findByPublicKey(publicKey) {
		return new Promise((resolve, reject) => {
			sqlLiteService
				.select(TABLE_NAME, '*', { publicKey: publicKey })
				.then(rows => {
					if (rows && rows.length === 1) {
						resolve(rows[0]);
					} else {
						resolve(null);
					}
				})
				.catch(error => {
					reject({ message: 'wallet_findByPublicKey', error: error });
				});
		});
	}

	function _updateProfilePicture(args) {
		return knex.transaction(trx => {
			let selectPromise = knex(TABLE_NAME)
				.transacting(trx)
				.select()
				.where('id', args.id);
			selectPromise
				.then(rows => {
					return new Promise((resolve, reject) => {
						let wallet = rows[0];

						wallet.profilePicture = args.profilePicture;

						knex(TABLE_NAME)
							.transacting(trx)
							.update(wallet)
							.where('id', args.id)
							.then(updatedData => {
								resolve(wallet);
							})
							.catch(error => {
								reject({ message: 'error', error: error });
							});
					});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		});
	}

	function _selectProfilePictureById(args) {
		return new Promise((resolve, reject) => {
			knex(TABLE_NAME)
				.select()
				.where('id', args.id)
				.then(rows => {
					if (rows && rows.length) {
						resolve(rows[0].profilePicture);
					} else {
						resolve(null);
					}
				})
				.catch(error => {
					reject({ message: 'error_while_selecting_profile_picture', error: error });
				});
		});
	}

	return Controller;
};
