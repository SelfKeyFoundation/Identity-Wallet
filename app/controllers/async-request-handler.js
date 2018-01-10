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

	const initialStoreDataStructure = {
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
		idAttributes: {},
		subscribtions: [],
		actionLogs: [],
		reminders: []
	};

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
				setup: {
					guideShown: false,
					termsAccepted: false,
					icoAdsShown: false
				},
				settings: {
					storeFilePath: storeFilePath,
					documentsDirectoryPath: documentsDirectoryPath,
					reminder: {
						notifyBeforeTimeLeft: 60 * 60 * 1000
					}
				},
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
			let options = {
				kdf: "pbkdf2",
				cipher: "aes-128-ctr",
				kdfparams: {
					c: 262144,
					dklen: 32,
					prf: "hmac-sha256"
				}
			};

			let keystoreObject = keythereum.dump(args.password, dk.privateKey, dk.salt, dk.iv, options);

			let keystoreFilePath = path.resolve(walletsDirectoryPath, keystoreObject.address);
			if (!fs.existsSync(keystoreFilePath)) {
				fs.mkdir(keystoreFilePath);
			}

			let outputPath = keythereum.exportToFile(keystoreObject, keystoreFilePath);
			let keystoreFileName = path.basename(outputPath);

			let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);
			settings.setPath(storeFilePath);

			let storeData = settings.getAll();

			if (!storeData.wallets[keystoreObject.address]) {
				storeData.wallets[keystoreObject.address] = {
					type: 'ks',
					name: "Unnamed Wallet",
					keystoreFilePath: path.resolve(keystoreFilePath, keystoreFileName),
					data: initialStoreDataStructure
				}
				settings.setAll(storeData);
			}

			let privateKey = keythereum.recover(args.password, keystoreObject);
			app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, { publicKey: keystoreObject.address, privateKey: privateKey });
		});
	}

	controller.prototype.importEtherKeystoreFile = function (event, actionId, actionName, args) {
		console.log(actionName, args);
		try {
			keythereum.importFromFile(args.filePath, function (keystoreObject) {
				let keyStoreFilePath = path.resolve(walletsDirectoryPath, keystoreObject.address);

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

							if (!storeData.wallets[keystoreObject.address]) {
								storeData.wallets[keystoreObject.address] = {
									type: 'ks',
									name: "Unnamed Wallet",
									keystoreFilePath: keyStoreFileNewPath,
									data: initialStoreDataStructure
								}
								settings.setAll(storeData);
							}

							app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, { publicKey: keystoreObject.address, keystoreObject: keystoreObject });
						} else {
							app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, err, null);
						}
					});
				} else {
					app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, {publicKey: keystoreObject.address, keystoreObject: keystoreObject});
				}
			});
		} catch (e) {
			console.log(e.message);
			app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, e.message, null);
		}
	};

	controller.prototype.unlockEtherKeystoreObject = function (event, actionId, actionName, args) {
		try {
			let privateKey = keythereum.recover(args.password, args.keystoreObject);
			if (privateKey) {
				app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, {privateKey: privateKey, publicKey: args.keystoreObject.address, keystoreObject: args.keystoreObject});
			} else {
				app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, "authentication code mismatch", null);
			}

		} catch (e) {
			console.log(">>>>>>>", e);
			app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, "authentication code mismatch", null);
		}
	}

	controller.prototype.importEtherPrivateKey = function (event, actionId, actionName, args) {
		try {
			let publicKey = ethereumjsUtil.privateToAddress(args.privateKey);
			publicKey = publicKey.toString('hex');

			let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);
			settings.setPath(storeFilePath);

			let storeData = settings.getAll();

			if (!storeData.wallets[publicKey]) {
				storeData.wallets[publicKey] = {
					type: "pk",
					name: "Unnamed Wallet",
					//privateKey: args.privateKey,
					data: initialStoreDataStructure
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
