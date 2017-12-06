module.exports = function (app) {
    let controller = {};

    let dialog = app.modules.electron.dialog;
    let win = app.win;
    let path = app.modules.path;
    let keythereum = app.modules.keythereum;
    const settings = require('electron-settings');
    const fs = require('fs');

    const storeFileName = 'main-store.json';
    const userDataDirectoryPath = app.modules.electron.app.getPath('userData');
    const walletsDirectoryPath = path.resolve(userDataDirectoryPath, 'wallets');
    const documentsDirectoryPath = path.resolve(userDataDirectoryPath, 'documents');

    console.log(userDataDirectoryPath);

    controller.readDataStore = function (event, actionId, actionName, args) {
        let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);

        settings.setPath(storeFilePath);

        const data = settings.getAll();
        app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, data);
    }

    controller.saveDataStore = function (event, actionId, actionName, args) {
        let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);

        settings.setPath(storeFilePath);

        const data = settings.setAll(args.data);
        app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, data);
    }

    controller.initDataStore = function (event, actionId, actionName, args) {
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
                    status: 'in-progress' // in-progress | skipped | done
                },
                statistics: {
                    appUsed: 0
                },
                settings: {
                    storeFilePath: storeFilePath,
                    documentsDirectoryPath: documentsDirectoryPath
                },
                idAttributes: {
                    documents: [],
                    contacts: []
                },
                wallets: {}
            });
        }

        const storeData = settings.getAll();

        console.log("storeData", storeData);

        app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, storeData);
    }

    // TODO - ??
    controller.createDirectory = function (event, actionId, actionName, args) {
        fs.mkdir(path.resolve(walletsDirectoryPath, args.publickKey));
        app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, storeData);
    }

    controller.checkFileStat = function (event, actionId, actionName, args) {
        try {
            app.modules.fs.stat(args.src, (err, stat) => {
                if (stat) {
                    stat.path = args.src;
                }
                app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, err, stat);
            });
        } catch (e) {
            app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, e, null);
        }
    }

    controller.openDirectorySelectDialog = function (event, actionId, actionName, args) {
        try {
            let dialogConfig = {
                title: 'Choose where to save documents',
                message: 'Choose where to save documents',
                properties: ['openDirectory']
            };
            app.modules.electron.dialog.showOpenDialog(app.win, dialogConfig, (filePaths) => {
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

    controller.openFileSelectDialog = function (event, actionId, actionName, args) {
        try {
            let dialogConfig = {
                title: 'Choose file',
                message: 'Choose file',
                properties: ['openFile']
            };
            app.modules.electron.dialog.showOpenDialog(app.win, dialogConfig, (filePaths) => {
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

    controller.signPdf = function (event, actionId, actionName, args) {
        let exec = require('child_process').exec;

        let execJarPath = app.modules.path.join(app.dir.desktopApp, 'executables', 'pdfsigner-0.0.1.jar');

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
            /*
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            callback(error, stdout)
            */
        });
    }

    controller.moveFile = function (event, actionId, actionName, args) {
        console.log(">>>>", args);
        args.dest += '/' + path.basename(args.src);
        if (args.copy) {
            app.controllers.helpers.copyFile(args.src, args.dest, (err) => {
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

    controller.generateEthereumWallet = function (event, actionId, actionName, args) {
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

    controller.importEtherKeystoreFile = function (event, actionId, actionName, args) {
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
                    app.controllers.helpers.copyFile(args.filePath, keyStoreFileNewPath, (err) => {
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

    controller.unlockEtherKeystoreObject = function (event, actionId, actionName, args) {
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

    controller.closeApp = function (event, actionId, actionName, args) {
        app.modules.electron.app.quit();
    }

    controller.testCustomNode = function (event, actionId, actionName, args) {
        console.log("testCustomNode", args);
        app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, { "test": "test" });
    }

    return controller;
}