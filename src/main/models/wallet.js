const { knex, sqlUtil } = require('../services/knex');
const { genRandId } = require('../../utils/crypto');
const WalletSetting = require('./wallet-setting');
const WalletToken = require('./wallet-token');
const IdAttributeTypes = require('./id-attribute-type');

const TABLE_NAME = 'wallets';
module.exports = {
	create: data =>
		knex.transaction(async trx => {
			let wallet = await sqlUtil.insertAndSelect(TABLE_NAME, data, trx);
			try {
				await WalletSetting.create(
					{ walletId: wallet.id, sowDesktopNotifications: 1 },
					trx
				);
				await WalletToken.create({ walletId: wallet.id, tokenId: 1 }, trx);
			} catch (error) {
				throw { message: 'wallet_init_error', error };
			}
			return wallet;
		}),

	findActive: tx =>
		sqlUtil.select(TABLE_NAME, '*', { isSetupFinished }, tx).catch(error => {
			throw { message: 'wallet_findActive', error };
		}),

	findAll: () =>
		knex(TABLE_NAME)
			.select()
			.whereNotNull('keystoreFilePath')
			.catch(error => {
				throw { message: 'wallet_findAll', error };
			}),

	findByPublicKey: publicKey =>
		sqlUtil.selectOne(TABLE_NAME, '*', { publicKey }).catch(error => {
			throw { message: 'wallet_findByPublicKey', error };
		}),

	updateProfilePicture: args =>
		knex.transaction(async trx => {
			let wallet = await sqlUtil.selectOneById(TABLE_NAME, '*', args.id, trx);
			wallet.profilePicture = args.profilePicture;
			try {
				await sqlUtil.updateById(TABLE_NAME, wallet.id, wallet, trx);
			} catch (error) {
				throw { message: 'error', error };
			}
			return wallet;
		}),

	selectProfilePictureById: async (args, tx) => {
		try {
			let wallet = await sqlUtil.selectOneById(TABLE_NAME, '*', args.id, tx);
			if (!wallet) return null;
			return wallet.profilePicture;
		} catch (error) {
			throw { message: 'error_while_selecting_profile_picture', error };
		}
	},

	addInitialIdAttributesAndActivate: async (walletId, initialIdAttributes) =>
		knex.transaction(async trx => {
			let wallet = await sqlUtil.selectOneById(TABLE_NAME, '*', walletId, trx);
			let idAttributeTypes = await IdAttributeTypes.findInitial(trx);
			let idAttributesSavePromises = [];
			for (let i in idAttributeTypes) {
				let idAttributeType = idAttributeTypes[i];

				let item = {
					walletId: wallet.id,
					idAttributeType: idAttributeType.key,
					items: [],
					createdAt: Date.now()
				};

				item.items.push({
					id: genRandId(),
					name: null,
					isVerified: 0,
					order: 0,
					createdAt: Date.now(),
					updatedAt: null,
					values: [
						{
							id: genRandId(),
							staticData: {
								line1: initialIdAttributes[idAttributeType.key]
							},
							documentId: null,
							order: 0,
							createdAt: Date.now(),
							updatedAt: null
						}
					]
				});

				item.items = JSON.stringify(item.items);

				// add initial id attributes
				idAttributesSavePromises.push(
					sqlUtil.insertAndSelect('id_attributes', item, trx).catch(error => {
						console.log(error);
					})
				);
			}
			try {
				await Promise.all(idAttributesSavePromises);
			} catch (error) {
				console.log(error);
				throw { message: 'wallets_insert_error', error: error };
			}
			wallet.isSetupFinished = 1;
			try {
				await sqlUtil.updateById(TABLE_NAME, wallet.id, wallet, trx);
				return wallet;
			} catch (error) {
				console.log(error);
				throw { message: 'wallets_insert_error', error };
			}
		}),

	editImportedIdAttributes: (walletId, initialIdAttributes) =>
		knex.transaction(async trx => {
			let wallet = await sqlUtil.selectOneById(TABLE_NAME, '*', walletId, trx);
			let idAttributeTypes = await IdAttributeTypes.findInitial(trx);
			let idAttributeTypesSelectPromises = [];
			let idAttributesSavePromises = [];

			let idAttributesToInsert = [];

			for (let i in idAttributeTypes) {
				let idAttributeType = idAttributeTypes[i];

				idAttributeTypesSelectPromises.push(
					sqlUtil
						.select(
							'id_attributes',
							'*',
							{ walletId, idAttributeType: idAttributeType.key },
							trx
						)
						.then(idAttributes => {
							let idAttribute = null;

							if (idAttributes && idAttributes.length === 1) {
								idAttribute = idAttributes[0];
								idAttribute.items = JSON.parse(idAttribute.items);
								if (initialIdAttributes[idAttributeType.key]) {
									idAttribute.items[0].values[0].staticData.line1 =
										initialIdAttributes[idAttributeType.key];
								}
								idAttribute.items = JSON.stringify(idAttribute.items);
							} else {
								idAttribute = {
									walletId: wallet.id,
									idAttributeType: idAttributeType.key,
									items: [],
									createdAt: Date.now()
								};

								idAttribute.items.push({
									id: genRandId(),
									name: null,
									isVerified: 0,
									order: 0,
									createdAt: Date.now(),
									updatedAt: null,
									values: [
										{
											id: genRandId(),
											staticData: {
												line1: initialIdAttributes[idAttributeType.key]
											},
											documentId: null,
											order: 0,
											createdAt: Date.now(),
											updatedAt: null
										}
									]
								});
								idAttribute.items = JSON.stringify(idAttribute.items);
							}

							return idAttribute;
						})
				);
			}

			let idAttributesList = await Promise.all(idAttributeTypesSelectPromises);

			let finalPromises = [];

			for (let i in idAttributesList) {
				(function() {
					let idAttribute = idAttributesList[i];
					if (idAttribute.id) {
						finalPromises.push(
							sqlUtil.update(
								'id_attributes',
								idAttribute,
								{ id: idAttribute.id },
								trx
							)
						);
					} else {
						finalPromises.push(
							sqlUtil.insertAndSelect('id_attributes', idAttribute, trx)
						);
					}
				})(i);
			}

			await Promise.all(finalPromises);

			wallet.isSetupFinished = 1;
			try {
				await Wallet.updateById(wallet.id, wallet, trx);
			} catch (error) {
				throw { message: 'wallets_insert_error', error };
			}
			return wallet;
		})
};
