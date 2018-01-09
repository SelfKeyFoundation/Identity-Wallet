'use strict';

const electron = require('electron');
const {dialog} = require('electron');
const {Notification} = require('electron');
const path = require('path');
const keythereum = require('../extended_modules/keythereum');
const deskmetrics = require('deskmetrics');
const mime = require('mime-types');
const settings = require('electron-settings');
const fs = require('fs');
const ethereumjsUtil = require('ethereumjs-util');

module.exports = function (app) {
	const helpers = require('./helpers')(app);
	const controller = function() {};

	const storeFileName = 'main-store.json'; // TODO
	const userDataDirectoryPath = electron.app.getPath('userData');
	const walletsDirectoryPath = path.resolve(userDataDirectoryPath, 'wallets');
	const documentsDirectoryPath = path.resolve(userDataDirectoryPath, 'documents');

	console.log(userDataDirectoryPath);

	controller.prototype.readDataStore = function (event, actionId, actionName, args) {
		let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);

		settings.setPath(storeFilePath);

		const data = settings.getAll();
		app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, data);
	}

	controller.prototype.saveDataStore = function (event, actionId, actionName, args) {
		let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);

		settings.setPath(storeFilePath);

		const data = settings.setAll(args.data);
		app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, data);
	}

	controller.prototype.initDataStore = function (event, actionId, actionName, args) {
		let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);

		settings.setPath(storeFilePath);

		if (!fs.existsSync(walletsDirectoryPath)) {
			fs.mkdir(walletsDirectoryPath);
		}

		if (!fs.existsSync(documentsDirectoryPath)) {
			fs.mkdir(documentsDirectoryPath);
		}

		// check file exists
		if (!fs.existsSync(storeFilePath)) {
			settings.setAll({
				profile: {
					picture: {
						path: "",
						fileSize: null,
						imageSize: {
							width: "",
							height: ""
						},
						position: {
							x: "",
							y: ""
						},
						backgroundColor: ""
					}
				},
				setup: {
					status: 'in-progress', // in-progress | skipped | done (TODO remove)
					guideShown: false,
					initialIdAttributesSetup: "in-progress", // in-progress | skipped | done
					termsAccepted: false,
					icoAdsShown: false
				},
				statistics: {
					appUsed: 0
				},
				settings: {
					storeFilePath: storeFilePath,
					documentsDirectoryPath: documentsDirectoryPath,
					reminder: {
						notifyBeforeTimeLeft: 60 * 60 * 1000
					}
				},
				idAttributes: {
					"email": {
						"isInitial": true,
						"category": "global_attribute",
						"defaultItemId": "1",
						"entity": [
							"individual",
							"company"
						],
						"items": {
							"1": {
								"_id": "1",
								"idAttributeType": {
									"category": "global_attribute",
									"entity": [
										"individual",
										"company"
									],
									"key": "email",
									"type": "static_data"
								},
								"value": ""
							}
						},
						"key": "email",
						"type": "static_data"
					},
					"name": {
						"isInitial": true,
						"category": "global_attribute",
						"defaultItemId": "1",
						"entity": [
							"individual"
						],
						"items": {
							"1": {
								"_id": "1",
								"idAttributeType": {
									"category": "global_attribute",
									"entity": [
										"individual"
									],
									"key": "name",
									"type": "static_data"
								},
								"value": ""
							}
						},
						"key": "name",
						"type": "static_data"
					},
					"national_id": {
						"isInitial": true,
						"category": "id_document",
						"defaultItemId": "1",
						"entity": [
							"individual"
						],
						"items": {
							"1": {
								"_id": "1",
								"contentType": "",
								"idAttributeType": {
									"category": "id_document",
									"entity": [
										"individual"
									],
									"key": "national_id",
									"type": "document"
								},
								"name": "",
								"size": null,
								"value": "",
								"addition": {
									"selfie": false, 
									"signature": false, 
									"notary": false, 
									"certified_true_copy": false
								}
							},
							"2": {
								"_id": "2",
								"contentType": "",
								"idAttributeType": {
									"category": "id_document",
									"entity": [
										"individual"
									],
									"key": "national_id",
									"type": "document"
								},
								"name": "",
								"size": null,
								"value": "",
								"addition": {
									"selfie": true, 
									"signature": false, 
									"notary": false, 
									"certified_true_copy": false
								}
							}
						},
						"key": "national_id",
						"type": "document"
					},
					"country_of_residency": {
						"isInitial": true,
						"category": "global_attribute",
						"defaultItemId": "1",
						"entity": [
							"individual"
						],
						"items": {
							"1": {
								"_id": "1",
								"contentType": "",
								"idAttributeType": {
									"category": "global_attribute",
									"entity": [
										"individual"
									],
									"key": "country_of_residency",
									"type": "static_data"
								},
								"name": "",
								"size": "",
								"value": ""
							}
						},
						"key": "country_of_residency",
						"type": "static_data"
					}
				},
				subscribtions: [],
				actionLogs: [
					{
						date : new Date(),
                   		type : 'notification',
                    	text : 'something'
					},{
						date : new Date(),
                   		type : 'wallet',
                    	text : 'other something'
					},{
						date : new Date(),
                   		type : 'notification',
                    	text : 'third something'
					}
				],
				reminders: [
					{
						reminderDate : new Date(new Date().getTime() + (60 * 60 * 1000)),
						date : new Date(),
                   		type : 'regular',
                    	text : 'something'
					},
					{
						reminderDate : new Date(new Date().getTime() + (60 * 60 * 1000 * 0.5)),
						date : new Date(),
                   		type : 'regular',
                    	text : 'something'
					},
					{
						reminderDate : new Date(new Date().getTime() + (60 * 60 * 1000 * 3)),
						date : new Date(),
                   		type : 'regular',
                    	text : 'something'
					}
				],
				tokens: {
					eth: {
						type: 'default',
						lastBalance: 0
					},
					qey: {
						type: 'custom',
						lastBalance: 0,
						contract: {
							address: "0x3e6f45f183492a644db9d3e1fc3fb8d48ea99421",
							symbol: "QEY",
							decimal: 18,
							type: "default"
						}
					}
				},
				wallets: {}
			});
		}

		const storeData = settings.getAll();

		console.log("storeData", storeData);

		app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, storeData);
	}

	// TODO - ??
	controller.prototype.createDirectory = function (event, actionId, actionName, args) {
		fs.mkdir(path.resolve(walletsDirectoryPath, args.publickKey));
		app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, storeData);
	}

	controller.prototype.checkFileStat = function (event, actionId, actionName, args) {
		try {
			fs.stat(args.src, (err, stat) => {
				if (stat) {
					stat.path = args.src;
				}
				app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, err, stat);
			});
		} catch (e) {
			app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, e, null);
		}
	}

	controller.prototype.openDirectorySelectDialog = function (event, actionId, actionName, args) {
		try {
			let dialogConfig = {
				title: 'Choose where to save documents',
				message: 'Choose where to save documents',
				properties: ['openDirectory']
			};
			dialog.showOpenDialog(app.win, dialogConfig, (filePaths) => {
				if (filePaths) {
					app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, filePaths[0]);
				} else {
					app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, null);
				}
			});
		} catch (e) {
			app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, e, null);
		}
	}

	controller.prototype.openFileSelectDialog = function (event, actionId, actionName, args) {
		try {
			let dialogConfig = {
				title: 'Choose file',
				message: 'Choose file',
				properties: ['openFile']
			};
			dialog.showOpenDialog(app.win, dialogConfig, (filePaths) => {
				if (filePaths) {
					try {
						const stats = fs.statSync(filePaths[0]);
						let mimeType = mime.lookup(filePaths[0]);

						app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, {mimeType: mimeType, path: filePaths[0], size: stats.size});
					} catch (e) {
						console.log(e);
						app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, 'error', null);
					}
				} else {
					app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, null);
				}
			});
		} catch (e) {
			app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, e, null);
		}
	}

	controller.prototype.signPdf = function (event, actionId, actionName, args) {
		let exec = require('child_process').exec;

		let execJarPath = path.join(app.dir.desktopApp, 'executables', 'pdfsigner-0.0.1.jar');

		let command = 'java -jar ' + execJarPath + ' ';
		command += '-input ' + args.input + ' ';
		command += '-output ' + args.output + ' ';
		command += '-cert ' + args.certificate + ' ';
		command += '-password ' + args.password;

		exec(command, function (error, stdout, stderr) {
			if (error || stderr) {
				callback('error', null);
				app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, 'error', null);
			} else {
				let data = stdout.toString().split('\n')[0];
				app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, data);
			}
		});
	}

	controller.prototype.moveFile = function (event, actionId, actionName, args) {
		args.dest += '/' + path.basename(args.src);
		if (args.copy) {
			helpers.copyFile(args.src, args.dest, (err) => {
				if (!err) {
					app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, args.dest);
				} else {
					app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, err, null);
				}
			});
		} else {
			// TODO
			app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, 'not implemented yet', null);
		}
	}

	controller.prototype.generateEthereumWallet = function (event, actionId, actionName, args) {
		const params = { keyBytes: 32, ivBytes: 16 };
		let dk = keythereum.create(params);

		// asynchronous
		keythereum.create(params, function (dk) {
			console.log(dk);

			let options = {
				kdf: "pbkdf2",
				cipher: "aes-128-ctr",
				kdfparams: {
					c: 262144,
					dklen: 32,
					prf: "hmac-sha256"
				}
			};

			let keystore = keythereum.dump(args.password, dk.privateKey, dk.salt, dk.iv, options);

			let keystoreFilePath = path.resolve(walletsDirectoryPath, keystore.address);
			if (!fs.existsSync(keystoreFilePath)) {
				fs.mkdir(keystoreFilePath);
			}

			let outputPath = keythereum.exportToFile(keystore, keystoreFilePath);
			let keystoreFileName = path.basename(outputPath);

			console.log("createEthereumAddress", keystore);

			let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);
			settings.setPath(storeFilePath);

			let storeData = settings.getAll();

			if (!storeData.wallets[keystore.address]) {
				storeData.wallets[keystore.address] = {
					name: "Unnamed Wallet",
					keystoreFilePath: path.resolve(keystoreFilePath, keystoreFileName)
				}
				settings.setAll(storeData);
			}

			let privateKey = keythereum.recover(args.password, keystore);

			app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, { keystore: keystore, privateKey: privateKey, keystoreFilePath: keystoreFilePath });
		});
	}

	controller.prototype.importEtherKeystoreFile = function (event, actionId, actionName, args) {
		try {
			keythereum.importFromFile(args.filePath, function (keyObject) {
				console.log("importEtherKeystoreFile", keyObject);
				let keyStoreFilePath = path.resolve(walletsDirectoryPath, keyObject.address);
				if (!fs.existsSync(keyStoreFilePath)) {
					fs.mkdir(keyStoreFilePath);
				}

				let keystoreFileName = path.basename(args.filePath);
				let keyStoreFileNewPath = path.resolve(keyStoreFilePath, keystoreFileName);

				if (!fs.existsSync(keyStoreFileNewPath)) {
					helpers.copyFile(args.filePath, keyStoreFileNewPath, (err) => {
						if (!err) {
							let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);
							settings.setPath(storeFilePath);

							let storeData = settings.getAll();

							if (!storeData.wallets[keyObject.address]) {
								storeData.wallets[keyObject.address] = {
									name: "Unnamed Wallet",
									keystoreFilePath: keyStoreFileNewPath
								}
								settings.setAll(storeData);
							}

							app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, keyObject);
						} else {
							app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, err, null);
						}
					});

				} else {
					app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, keyObject);
				}
			});
		} catch (e) {
			console.log(e.message);
			app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, e.message, null);
		}
	};

	controller.prototype.unlockEtherKeystoreObject = function (event, actionId, actionName, args) {
		console.log("unlockEtherKeystoreObject", args);
		try {
			let privateKey = keythereum.recover(args.password, args.keystoreObject);
			if (privateKey) {
				app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, privateKey);
			} else {
				app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, { message: "authentication code mismatch" }, null);
			}

		} catch (e) {
			app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, { message: "authentication code mismatch" }, null);
		}
	}

	controller.prototype.importEtherPrivateKey = function (event, actionId, actionName, args) {
		try {
			let publicKey = ethereumjsUtil.privateToPublic(args.privateKey);
			publicKey = publicKey.toString('hex');
			
			let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);
			settings.setPath(storeFilePath);

			let storeData = settings.getAll();

			if (!storeData.wallets[publicKey]) {
				storeData.wallets[publicKey] = {
					type: "privateKey",
					name: "Unnamed Wallet",
					privateKey: args.privateKey
				}
				settings.setAll(storeData);
			}

			app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, {
				privateKey: args.privateKey, 
				publicKey: publicKey
			});
		} catch (e) {
			app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, e.message, null);
		}
	};

	controller.prototype.closeApp = function (event, actionId, actionName, args) {
		electron.app.quit();
	}

	controller.prototype.testCustomNode = function (event, actionId, actionName, args) {
		console.log("testCustomNode", args);
		app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, { "test": "test" });
	}

	controller.prototype.showNotification = function (event, actionId, actionName, args) {
		console.log(args)
		let notification = new Notification({
			title: args.title,
			body: args.text
		});

		notification.on('click', (event) => {
			console.log('>>>>>>> Notification clicked', args.options);
			app.win.webContents.send('ON_NOTIFICATION_CLICK', args.options);
		});

		notification.show();

		app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, true);
	}

	controller.prototype.analytics = function (event, actionId, actionName, args) {
		deskmetrics.send(args.event, args.data)
		app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, true);
	}

	return controller;
}
