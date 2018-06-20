'use strict';

const electron = require('electron');
const { dialog, Notification, shell, autoUpdater } = require('electron');

const path = require('path');
const fs = require('fs-extra');
const fsm = require('fs');

const keythereum = require('../extended_modules/keythereum');

const mime = require('mime-types');
const settings = require('electron-settings');
const ethereumjsUtil = require('ethereumjs-util');
const decompress = require('decompress');
const os = require('os');
const async = require('async');
const log = require('electron-log');


const RPC_METHOD = "ON_RPC";
const RPC_ON_DATA_CHANGE_METHOD= 'ON_DATA_CHANGE';


module.exports = function (app) {
    const log = app.log;

    const helpers = require('./helpers')(app);
    const controller = function () {
    };

    const storeFileName = 'main-store.json'; // TODO
    const userDataDirectoryPath = electron.app.getPath('userData');
    const walletsDirectoryPath = path.resolve(userDataDirectoryPath, 'wallets');
    const documentsDirectoryPath = path.resolve(userDataDirectoryPath, 'documents');

    log.info(userDataDirectoryPath);

    /**
     * refactored methods
     */
    controller.prototype.getWalletsDirectoryPath = function (event, actionId, actionName, args) {
        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, walletsDirectoryPath);
    }

    // refactored
    controller.prototype.createKeystoreFile = function (event, actionId, actionName, args) {
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
            let keystoreFileFullPath = path.resolve(walletsDirectoryPath, keystoreObject.address);

            if (!fs.existsSync(keystoreFileFullPath)) {
                fs.mkdir(keystoreFileFullPath);
            }

            let outputPath = keythereum.exportToFile(keystoreObject, keystoreFileFullPath);
            let keystoreFileName = path.basename(outputPath);
            let keystoreFilePath = path.join(keystoreObject.address, keystoreFileName);

            electron.app.sqlLiteService.Wallet.add(
                {
                    publicKey: keystoreObject.address,
                    keystoreFilePath: keystoreFilePath
                }
            ).then((resp) => {
                let privateKey = keythereum.recover(args.password, keystoreObject);
                app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                    id: resp.id,
                    isSetupFinished: resp.isSetupFinished,
                    publicKey: keystoreObject.address,
                    privateKey: privateKey,
                    keystoreFilePath: keystoreFilePath
                });
            }).catch((error) => {
                app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
            });
        });
    }

    // refactored
    controller.prototype.importKeystoreFile = function (event, actionId, actionName, args) {
        try {
            keythereum.importFromFile(args.keystoreFilePath, (keystoreObject) => {
                let privateKey = keythereum.recover(args.password, keystoreObject);

                if (privateKey) {
                    let keystoreFileFullPath = path.resolve(walletsDirectoryPath, keystoreObject.address);

                    if (!fs.existsSync(keystoreFileFullPath)) {
                        fs.mkdir(keystoreFileFullPath);
                    }

                    let keystoreFileName = path.basename(args.keystoreFilePath);
                    let targetPath = path.join(keystoreFileFullPath, keystoreFileName);
                    let ksFilePathToSave = path.join(keystoreObject.address, keystoreFileName);

                    helpers.copyFile(args.keystoreFilePath, targetPath, (error) => {
                        if (error) {
                            return app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
                        }

                        electron.app.sqlLiteService.Wallet.add(
                            {
                                publicKey: keystoreObject.address,
                                keystoreFilePath: ksFilePathToSave
                            }
                        ).then((resp) => {
                            let privateKey = keythereum.recover(args.password, keystoreObject);
                            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                                id: resp.id,
                                isSetupFinished: resp.isSetupFinished,
                                publicKey: keystoreObject.address,
                                privateKey: privateKey,
                                keystoreFilePath: ksFilePathToSave, 
                                profile: 'local'
                            });
                        }).catch((error) => {
                            if (error.code === 'SQLITE_CONSTRAINT') {
                                app.win.webContents.send(RPC_METHOD, actionId, actionName, "wallet_already_imported", null);
                            } else {
                                app.win.webContents.send(RPC_METHOD, actionId, actionName, error.code, null);
                            }
                        });
                    });
                } else {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, "incorrect_password", null);
                }
            })
        } catch (e) {
            console.log(e);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, 'incorrect_password', null);
        }
    }

    // refactored
    controller.prototype.unlockKeystoreFile = function (event, actionId, actionName, args) {
        try {
            let selectWalletPromise = electron.app.sqlLiteService.Wallet.findByPublicKey(args.publicKey);
            selectWalletPromise.then((wallet) => {
                let keystoreFileName = path.basename(wallet.keystoreFilePath);
                let keystoreFileFullPath = path.join(walletsDirectoryPath, wallet.keystoreFilePath);

                keythereum.importFromFile(keystoreFileFullPath, (keystoreObject) => {

                    let privateKey = keythereum.recover(args.password, keystoreObject);

                    if (privateKey) {
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                            id: wallet.id,
                            isSetupFinished: wallet.isSetupFinished,
                            privateKey: privateKey,
                            publicKey: keystoreObject.address,
                            keystoreFilePath: wallet.keystoreFilePath,
                            profile: wallet.profile
                        });
                    } else {
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, "incorrect_password", null);
                    }
                });
            }).catch((error) => {
                app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
            });
        } catch (e) {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e.message, null);
        }
    }

    // refactored
    controller.prototype.importPrivateKey = function (event, actionId, actionName, args) {
        try {
            let publicKey = ethereumjsUtil.privateToAddress(args.privateKey);
            publicKey = publicKey.toString('hex');

            let privateKeyBuffer = Buffer.from(args.privateKey.replace("0x", ""), "hex")
            let walletSelectPromise = electron.app.sqlLiteService.Wallet.findByPublicKey(publicKey);

            walletSelectPromise.then((wallet) => {
                if (wallet) {
                    wallet.privateKey = privateKeyBuffer;
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, wallet);
                } else {
                    electron.app.sqlLiteService.Wallet.add(
                        {
                            publicKey: publicKey
                        }
                    ).then((resp) => {
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                            id: resp.id,
                            isSetupFinished: resp.isSetupFinished,
                            publicKey: publicKey,
                            privateKey: privateKeyBuffer
                        });
                    }).catch((error) => {
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, error.code, null);
                    });
                }
            }).catch((error) => {
                log.error(error);
                app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
            });
        } catch (e) {
            log.error(e);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e.message, null);
        }
    }

    // refactored
    controller.prototype.openKeystoreFileSelectDialog = function (event, actionId, actionName, args) {
        try {
            let dialogConfig = {
                title: 'Choose keystore file',
                message: 'Select file',
                properties: ['openFile']
            };

            dialog.showOpenDialog(app.win, dialogConfig, (filePaths) => {
                if (filePaths) {
                    try {
                        keythereum.importFromFile(filePaths[0], (keystoreObject) => {
                            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                                publicKey: keystoreObject.address,
                                keystoreFilePath: filePaths[0]
                            });
                        });
                    } catch (e) {
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, 'wrong_keystore_file', null);
                    }
                } else {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, null);
                }
            });
        } catch (e) {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e, null);
        }
    }

    controller.prototype.moveFile = function (event, actionId, actionName, args) {
        args.dest += '/' + path.basename(args.src);
        if (args.copy) {
            helpers.copyFile(args.src, args.dest, (error) => {
                if (!error) {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, args.dest);
                } else {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
                }
            });
        } else {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, 'method_not_implemented', null);
        }
    }

    controller.prototype.openDocumentAddDialog = function (event, actionId, actionName, args) {
        try {
            let dialogConfig = {
                title: 'Choose Document',
                message: 'Choose file',
                properties: ['openFile'],
                filters: [
                    { name: 'Documents', extensions: ['jpg', 'png', 'pdf'] },
                ],
                maxFileSize: 50 * 1000 * 1000
            };

            dialog.showOpenDialog(app.win, dialogConfig, (filePaths) => {
                if (filePaths) {
                    try {
                        const stats = fs.statSync(filePaths[0]);
                        let mimeType = mime.lookup(filePaths[0]);
                        let name = path.parse(filePaths[0]).base;

                        if (stats.size > dialogConfig.maxFileSize) {
                            return app.win.webContents.send(RPC_METHOD, actionId, actionName, 'file_size_error', null);
                        }

                        fsm.open(filePaths[0], 'r', (status, fd) => {
                            if (status) {
                                return app.win.webContents.send(RPC_METHOD, actionId, actionName, 'file_read_error', null);
                            }

                            var buffer = new Buffer(stats.size);
                            fsm.read(fd, buffer, 0, stats.size, 0, (err, num) => {

                                args.file = {
                                    name: name,
                                    buffer: buffer,
                                    mimeType: mimeType,
                                    size: stats.size
                                }

                                electron.app.sqlLiteService.IdAttribute.addEditDocumentToIdAttributeItemValue(
                                    args.idAttributeId,
                                    args.idAttributeItemId,
                                    args.idAttributeItemValueId,
                                    args.file,
                                ).then((resp) => {
                                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, resp);
                                }).catch((error) => {
                                    app.win.webContents.send(RPC_METHOD, actionId, actionName, 'error', null);
                                });
                            });
                        });
                    } catch (e) {
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, 'error', null);
                    }
                } else {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, null);
                }
            });
        } catch (e) {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e, null);
        }
    }

    controller.prototype.openFileViewer = function (event, actionId, actionName, args) {
        try {
            function onClose() {
                try {
                    let files = fsm.readdirSync(documentsDirectoryPath);
                    for (const file of files) {
                        fsm.unlinkSync(path.join(documentsDirectoryPath, file));
                    }
                } catch (e) {
                    return app.win.webContents.send(RPC_METHOD, actionId, actionName, e, null);
                }
            }

            electron.app.sqlLiteService.Document.findById(args.documentId).then((data) => {
                const filePathToPreview = path.join(documentsDirectoryPath, data.name);

                try {
                    fsm.appendFileSync(filePathToPreview, new Buffer(data.buffer));
                } catch (e) {
                    log.error(e);
                    return app.win.webContents.send(RPC_METHOD, actionId, actionName, e, null);
                }

                shell.openExternal(`file://${filePathToPreview}`);

                app.win.webContents.send(RPC_METHOD, actionId, actionName, null, null);
            }).catch((error) => {
                log.error(error);
                app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
            });
        } catch (e) {
            log.error(e);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e, null);
        }
    }

    controller.prototype.checkFileStat = function (event, actionId, actionName, args) {
        try {
            fs.stat(args.src, (err, stat) => {
                if (stat) {
                    stat.path = args.src;
                }
                app.win.webContents.send(RPC_METHOD, actionId, actionName, err, stat);
            });
        } catch (e) {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e, null);
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
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, filePaths[0]);
                } else {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, null);
                }
            });
        } catch (e) {
            log.error(e);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e, null);
        }
    }

    controller.prototype.openFileSelectDialog = function (event, actionId, actionName, args) {
        try {
            let dialogConfig = {
                title: 'Choose file',
                message: 'Choose file',
                properties: ['openFile']
            };

            if (args) {
                Object.assign(dialogConfig, args);
            }

            dialog.showOpenDialog(app.win, dialogConfig, (filePaths) => {
                if (filePaths) {
                    try {
                        const stats = fs.statSync(filePaths[0]);
                        let mimeType = mime.lookup(filePaths[0]);
                        let name = path.parse(filePaths[0]).base;

                        if (args && args.maxFileSize) {
                            if (stats.size > args.maxFileSize) {
                                return app.win.webContents.send(RPC_METHOD, actionId, actionName, 'file_size_error', null);
                            }
                        }

                        fsm.open(filePaths[0], 'r', (status, fd) => {
                            if (status) {
                                return app.win.webContents.send(RPC_METHOD, actionId, actionName, 'file_read_error', null);
                            }

                            var buffer = new Buffer(stats.size);
                            fsm.read(fd, buffer, 0, stats.size, 0, (err, num) => {
                                app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                                    name: name,
                                    mimeType: mimeType,
                                    path: filePaths[0],
                                    size: stats.size,
                                    buffer: buffer
                                });
                            });
                        });
                    } catch (e) {
                        log.error(e);
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, 'error', null);
                    }
                } else {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, null);
                }
            });
        } catch (e) {
            log.error(e);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e, null);
        }
    }

    controller.prototype.closeApp = function (event, actionId, actionName, args) {
        electron.app.quit();
    }

    controller.prototype.showNotification = function (event, actionId, actionName, args) {
        let notification = new Notification({
            title: args.title,
            body: args.text
        });

        notification.on('click', (event) => {
            app.win.webContents.send('ON_NOTIFICATION_CLICK', args.options);
        });

        notification.show();

        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, true);
    }

    controller.prototype.openBrowserWindow = function (event, actionId, actionName, args) {
        shell.openExternal(args.url);
        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, true);
    }

    /**
     * sql-lite methods
     */
    controller.prototype.loadDocumentById = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.Document.findById(args.documentId).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            log.error(error);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.actionLogs_add = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.ActionLog.add(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            log.error(error);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    // TODO - rename actionLogs_findByWalletId
    controller.prototype.actionLogs_findAll = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.ActionLog.findByWalletId(args.walletId).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            log.error(error);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.importKYCPackage = function (event, actionId, actionName, args) {

        function getDocs(kycprocess, requirementId, documentFiles) {
            let result = [];
            let documents = kycprocess.escrow.documents;
            for(let i in documents){
                let document = documents[i];
                if(document.requirementId == requirementId){

                    let fileItems = [];

                    let files = document.doc.files;
                    for(let j in files){
                        let file = files[j];
                        let fileItem = { name: files[j].fileName,  mimeType: files[j].contentType};

                        fileItem.buffer = documentFiles[fileItem.name] ? documentFiles[fileItem.name].buffer : null;
                        fileItem.size = documentFiles[fileItem.name] ? documentFiles[fileItem.name].size : null;

                        fileItems.push(fileItem);
                    }

                    result.push({
                        fileItems: fileItems
                    })
                }
            }
            return result;
        }

        function getStaticDatas(kycprocess, requirementId) {
            let result = [];
            let answers = kycprocess.escrow.answers;
            for(let i in answers){
                let answer = answers[i];
                if(answer.requirementId == requirementId){
                    result = answer.answer;
                }
            }
            return result;
        }

        function getStaticDataRequirements(kycprocess){
            let result = {};
            kycprocess.requirements.questions.forEach((item) => {
                if(!result[item.attributeType]){
                    result[item.attributeType] = {
                        _id: item._id,
                        attributeType: item.attributeType
                    };
                }
            });

            return result;
        }

        function getDocumentRequirements(kycprocess){
            let result = {};
            kycprocess.requirements.uploads.forEach((item) => {
                if(item.attributeType){
                    if(!result[item.attributeType]){
                        result[item.attributeType] = {
                            _id: item._id,
                            attributeType: item.attributeType
                        };
                    }
                }
            });

            return result;
        }

        try {
            let dialogConfig = {
                title: 'Import KYC Package',
                message: 'Choose file',
                properties: ['openFile'],
                filters: [
                    { name: 'Archive', extensions: ['zip'] },
                ],
                maxFileSize: 50 * 1000 * 1000
            };

            dialog.showOpenDialog(app.win, dialogConfig, (filePaths) => {
                if (filePaths && filePaths[0]) {
                    try {
                        decompress(filePaths[0], os.tmpdir()).then(files => {
                            let documentFiles = {};

                            files.forEach( (file) => {
                                if (['export_code', 'kycprocess.json'].indexOf(file.path) > 0) {
                                    return false;
                                }
                                documentFiles[file.path] = {
                                    buffer: file.data,
                                    size: file.data.byteLength
                                };
                            });

                            // searching for the json file
                            const kycprocessJSONFile = files.find((file) => {
                                if (file.path == "kycprocess.json") {
                                    return true;
                                }
                                return false;
                            });

                            // searching for the export_code file
                            const exportCodeFile = files.find((file) => {
                                if (file.path == "export_code") {
                                    return true;
                                }
                                return false;
                            });

                            const exportCode = exportCodeFile.data.toString('utf8');
                            const kycprocess = JSON.parse(kycprocessJSONFile.data.toString('utf8'));

                            let requiredDocuments = getDocumentRequirements(kycprocess);
                            let requiredStaticData = getStaticDataRequirements(kycprocess);

                            for(let i in requiredDocuments){
                                let docs = getDocs(kycprocess, requiredDocuments[i]._id, documentFiles);
                                requiredDocuments[i].docs = docs;
                            }

                            for(let i in requiredStaticData){
                                let staticDatas = getStaticDatas(kycprocess, requiredStaticData[i]._id);
                                console.log("THE static data", staticDatas);
                                requiredStaticData[i].staticDatas = staticDatas;
                            }

                            if(kycprocess.user.firstName){
                                requiredStaticData['first_name'] = {
                                    attributeType: 'first_name',
                                    staticDatas: [kycprocess.user.firstName]
                                };
                            }

                            if(kycprocess.user.lastName){
                                requiredStaticData['last_name'] = {
                                    attributeType: 'last_name',
                                    staticDatas: [kycprocess.user.lastName]
                                };
                            }

                            if(kycprocess.user.middleName){
                                requiredStaticData['middle_name'] = {
                                    attributeType: 'middle_name',
                                    staticDatas: [kycprocess.user.middleName]
                                };
                            }

                            if(kycprocess.user.email){
                                requiredStaticData['email'] = {
                                    attributeType: 'email',
                                    staticDatas: [kycprocess.user.email]
                                };
                            }

                            // ready - requiredDocuments, requiredStaticData, exportCode

                            electron.app.sqlLiteService.IdAttribute.addImportedIdAttributes(
                                args.walletId,
                                exportCode,
                                requiredDocuments,
                                requiredStaticData
                            ).then((data)=>{
                                app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
                            }).catch((error)=>{
                                app.win.webContents.send(RPC_METHOD, actionId, actionName, "error", null);
                            })
                        });
                    } catch (e) {
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, 'error', null);
                    }
                } else {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, null);
                }
            });
        } catch (e) {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, "error", null);
        }
    }


    controller.prototype.installUpdate = function (event, actionId, actionName, args) {
        autoUpdater.quitAndInstall();
        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, true);
    }

    controller.prototype.startTokenPricesBroadcaster = function (cmcService) {
        cmcService.eventEmitter.on('UPDATE', ()=>{
            electron.app.sqlLiteService.TokenPrice.findAll().then((data) => {
                app.win.webContents.send(RPC_ON_DATA_CHANGE_METHOD, 'TOKEN_PRICE', data);
            }).catch((error) => {
                console.log(error)
            });
        });
    }

    /**
     * SQL Lite
     */
    controller.prototype.getIdAttributeTypes = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.IdAttributeType.findAll().then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getTokens = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.Token.findAll().then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }



    controller.prototype.saveWallet = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.Wallet.add(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.findActiveWallets = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.Wallet.findActive().then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.findAllWallets = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.Wallet.findAll().then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.updateWalletprofilePicture = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.Wallet.updateProfilePicture(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getWalletProfilePicture = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.Wallet.selectProfilePictureById(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getWalletByPublicKey = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.wallets_selectByPublicKey(args.publicKey).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getCountries = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.Country.findAll().then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }


    // NEED TEST
    controller.prototype.getTxHistoryByPublicKey = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.TxHistory.findByPublicKey(args.publicKey).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getTxHistoryByPublicKeyAndTokenSymbol = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.TxHistory.findByPublicKeyAndTokenSymbol(args.publicKey, args.tokenSymbol).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getByPublicKeyAndContractAddress = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.TxHistory.findByPublicKeyAndContractAddress(args.publicKey, args.contractAddress).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.syncTxHistoryByAddress = function (event, actionId, actionName, args) {
        electron.app.txHistory.syncByAddress(args.publicKey).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.txHistoryAddOrUpdate = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.TxHistory.addOrUpdate(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    
    

    

    controller.prototype.getWalletSettingsByWalletId = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.WalletSetting.findByWalletId(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.saveWalletSettings = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.WalletSetting.edit(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.insertWalletToken = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.wallet_tokens_insert(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.insertNewWalletToken = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.wallet_new_token_insert(args.data, args.balance, args.walletId).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.updateWalletToken = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.wallet_tokens_update(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getGuideSettings = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.GuideSetting.findAll().then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.saveGuideSettings = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.GuideSetting.updateById(args.id, args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            log.error("saveGuideSettings - ", error)
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getWalletTokens = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.walletTokens_selectByWalletId(args.walletId).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    /**
     * IdAttribute
     */
    // DONE !!!!!
    controller.prototype.addInitialIdAttributesToWalletAndActivate = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.Wallet.addInitialIdAttributesAndActivate(args.walletId, args.initialIdAttributesValues).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    // DONE !!!!!
    controller.prototype.addEditDocumentToIdAttributeItemValue = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.IdAttribute.addEditDocumentToIdAttributeItemValue(args.idAttributeId, args.idAttributeItemId, args.idAttributeItemValueId, args.file).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    // DONE !!!!!
    controller.prototype.addEditStaticDataToIdAttributeItemValue = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.IdAttribute.addEditStaticDataToIdAttributeItemValue(args.idAttributeId, args.idAttributeItemId, args.idAttributeItemValueId, args.staticData).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    // DONE !!!!!
    controller.prototype.getIdAttributes = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.IdAttribute.findAllByWalletId(args.walletId).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    // DONE !!!!!
    controller.prototype.addIdAttribute = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.IdAttribute.create(args.walletId, args.idAttributeType, args.staticData, args.file).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    // DONE !!!!!
    controller.prototype.deleteIdAttribute = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.IdAttribute.delete(args.idAttributeId, args.idAttributeItemId, args.idAttributeItemValueId).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    // TODO .... test
    controller.prototype.editImportedIdAttributes = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.Wallet.editImportedIdAttributes(args.walletId, args.initialIdAttributesValues).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }



    /**
     * Exchange data
     */
    controller.prototype.findAllExchangeData = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.ExchangeDataHandler.findAll(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.loadObligatoryIcons = (event, actionId, actionName, args) => {
        const iconList = config.obligatoryImageIds;
        async.each(iconList, function (item, callback) {
            electron.app.sqlLiteService.tokens_selectBySymbol(item).then(data => {
                if (data) {
                    if (!data.icon) {
                        //TODO get image and update existing one
                    }
                } else {
                    //TODO insert ot continue ???
                }
            }).catch(err => {
                callback(err);
            });
        }, function (err) {
            if (err) {
                app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, err, null);
            } else {
                app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, true);
            }
        });
    };
 
    controller.prototype.getLedgerAccounts = function (event, actionId, actionName, args) {
        electron.app.ledgerService.getAccounts(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.signTransactionWithLedger = function (event, actionId, actionName, args) {
        electron.app.ledgerService.signTransaction(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

     controller.prototype.createLedgerWalletByAdress = function (event, actionId, actionName, args) {
        try {
            let publicKey = args.address;
            let profile = 'ledger';
            publicKey = publicKey.toString('hex');

            let walletSelectPromise = electron.app.sqlLiteService.Wallet.findByPublicKey(publicKey);
            walletSelectPromise.then((wallet) => {
                if (wallet) {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, wallet);
                } else {
                    electron.app.sqlLiteService.Wallet.add(
                        {
                            publicKey,
                            profile 
                        }
                    ).then((resp) => {
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                            id: resp.id,
                            isSetupFinished: resp.isSetupFinished,
                            publicKey,
                            profile
                        });
                    }).catch((error) => {
                        log.error(error);
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, error.code, null);
                    });
                }
            }).catch((error) => {
                log.error(error);
                app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
            });
        } catch (e) {
            log.error(e);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e.message, null);
        }
    }

    controller.prototype.waitForWeb3Ticket = function (event, actionId, actionName, args) {
        electron.app.web3Service.waitForTicket(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error.toString(), null);
        });
    }


    return controller;
}
