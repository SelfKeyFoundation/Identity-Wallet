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

const RPC_METHOD = "ON_RPC";

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

    // used
    controller.prototype.createWallet = function (event, actionId, actionName, args) {
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

            electron.app.sqlLiteService.wallets_insert(
                {
                    publicKey: keystoreObject.address,
                    keystoreFilePath: keystoreFilePath
                },
                args.initialIdAttributesValues
            ).then((resp) => {
                let privateKey = keythereum.recover(args.password, keystoreObject);
                app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                    id: resp.id,
                    publicKey: keystoreObject.address,
                    privateKey: privateKey,
                    keystoreFilePath: keystoreFilePath
                });
            }).catch((error) => {
                app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
            });
        });
    }

    controller.prototype.readKeystoreObject = function (event, actionId, actionName, args) {
        try {
            keythereum.importFromFile(args.filePath, (keystoreObject) => {
                let keystoreFileName = path.basename(args.filePath);

                app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                    publicKey: keystoreObject.address,
                    keystoreFilePath: args.filePath
                });
            });
        } catch (e) {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e.message, null);
        }
    }

    // used
    controller.prototype.unlockExistingWallet = function (event, actionId, actionName, args) {
        try {
            let selectWalletPromise = electron.app.sqlLiteService.wallets_selectByPublicKey(args.publicKey)
            selectWalletPromise.then((wallet) => {
                let keystoreFileName = path.basename(wallet.keystoreFilePath);
                let keystoreFileFullPath = path.join(walletsDirectoryPath, wallet.keystoreFilePath);

                keythereum.importFromFile(keystoreFileFullPath, (keystoreObject) => {
                    let privateKey = keythereum.recover(args.password, keystoreObject);

                    if (privateKey) {
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                            id: wallet.id,
                            privateKey: privateKey,
                            publicKey: keystoreObject.address,
                            keystoreFilePath: wallet.keystoreFilePath
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

    controller.prototype.unlockEtherKeystoreObject = function (event, actionId, actionName, args) {
        try {
            let privateKey = keythereum.recover(args.password, args.keystoreObject);
            if (privateKey) {
                app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                    privateKey: privateKey,
                    publicKey: args.keystoreObject.address,
                    keystoreObject: args.keystoreObject
                });
            } else {
                app.win.webContents.send(RPC_METHOD, actionId, actionName, "authentication code mismatch", null);
            }
        } catch (e) {
            log.error(e);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, "authentication code mismatch", null);
        }
    }

    // used
    controller.prototype.importEtherPrivateKey = function (event, actionId, actionName, args) {
        try {
            let publicKey = ethereumjsUtil.privateToAddress(args.privateKey);
            publicKey = publicKey.toString('hex');

            let privateKeyBuffer = Buffer.from(args.privateKey.replace("0x", ""), "hex")
            let walletSelectPromise = electron.app.sqlLiteService.wallets_selectByPublicKey({ publicKey: publicKey });

            walletSelectPromise.then((wallet) => {
                if (wallet) {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, wallet);
                } else {
                    // TODO insert into sqlLite
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                        publicKey: publicKey,
                        privateKey: args.privateKey,
                        privateKeyBuffer: privateKeyBuffer,
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

    // used
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

    // used
    controller.prototype.unlockKeystoreFile = function (event, actionId, actionName, args) {
        try {
            keythereum.importFromFile(args.keystoreFilePath, (keystoreObject) => {
                let privateKey = keythereum.recover(args.password, keystoreObject);

                if (privateKey) {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                        privateKey: privateKey,
                        publicKey: keystoreObject.address,
                        keystoreFilePath: args.keystoreFilePath,
                        password: args.password
                    });
                } else {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, "incorrect_password", null);
                }
            }).catch((error) => {
                app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
            });
        } catch (e) {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e.message, null);
        }
    }

    // used
    controller.prototype.importAndUnlockExistingWallet = function (event, actionId, actionName, args) {
        try {
            let keystoreFileFullPath = path.resolve(walletsDirectoryPath, args.publicKey);

            let keystoreFileDirectoryPath = path.resolve(walletsDirectoryPath, args.publicKey);

            if (!fs.existsSync(keystoreFileDirectoryPath)) {
                fs.mkdir(keystoreFileDirectoryPath);
            }

            let keystoreFileName = path.basename(args.keystoreFilePath);
            let keystoreFilePath = path.join(args.publicKey, keystoreFileName);

            helpers.copyFile(args.keystoreFilePath, path.join(keystoreFileDirectoryPath, keystoreFileName), (error) => {
                if (!error) {
                    electron.app.sqlLiteService.wallets_insert(
                        {
                            publicKey: args.publicKey,
                            keystoreFilePath: keystoreFilePath
                        },
                        args.initialIdAttributesValues
                    ).then((resp) => {
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                            id: resp.id,
                            publicKey: args.publicKey,
                            privateKey: args.privateKey,
                            keystoreFilePath: keystoreFilePath
                        });
                    }).catch((error) => {
                        app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
                    });
                } else {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
                }
            });
        } catch (e) {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e.message, null);
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
                                electron.app.sqlLiteService.idAttributeItemValues_addDocument(
                                    {
                                        fileName: name,
                                        buffer: buffer,
                                        mimeType: mimeType,
                                        size: stats.size,
                                        idAttributeItemValueId: args.idAttributeItemValueId
                                    }
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

            electron.app.sqlLiteService.documents_selectById(args.documentId).then((data) => {
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
        electron.app.sqlLiteService.documents_selectById(args.documentId).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            log.error(error);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.actionLogs_add = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.actionLogs_add(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            log.error(error);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.actionLogs_findAll = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.actionLogs_findAll(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            log.error(error);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }









    /**
     * TODO check usage
     */




    /**
     * TODO - check & remove
     */
    // TODO keep this...
    controller.prototype.importKYCIdentity = function (event, actionId, actionName, args) {
        decompress(args.file.path, os.tmpdir()).then(files => {
            let documentFiles = {};

            //searching for documents
            files.forEach(function (file) {
                if (file.path == "kycprocess.json") {
                    return false;
                }
                documentFiles[file.path] = file;
            });


            //searching for the json file
            const jsonFile = files.find(function (file) {
                if (file.path == "kycprocess.json") {
                    return true;
                }
                return false;
            });


            const json = JSON.parse(jsonFile.data.toString('utf8'));
            let requirementQuestions = {};
            let requirementDocuments = {};
            let ethAddressRequirementId = "";

            //get all required uploads
            json.requirements.uploads.forEach(function (upload) {
                requirementDocuments[upload._id] = upload;
            })

            //get all required questions
            json.requirements.questions.forEach(function (question) {
                //if the question is ethereum address then save it into the selarate variable
                if (question.tokenSale.ethAddress) {
                    ethAddressRequirementId = question._id;
                } else {
                    requirementQuestions[question._id] = question;
                }

            })

            let etherAddress = "";
            let attributes = {};

            //check for answers on the quesitons
            json.escrow.answers.forEach(function (answer) {
                //if re requirement is the ether address then save answer to the separate variable
                if (answer.requirementId == ethAddressRequirementId) {
                    etherAddress = answer.answer[0];
                } else if (requirementQuestions[answer.requirementId]) {
                    let questionRequirement = requirementQuestions[answer.requirementId];
                    let idAttribute = questionRequirement.attributeType;
                    if (!idAttribute) {
                        return;
                    }

                    if (!attributes[idAttribute]) {
                        attributes[idAttribute] = [];
                    }
                    let obj = {
                        isDoc: false,
                        value: answer.answer[0]

                    };
                    attributes[idAttribute].push(obj);
                }
            })
            let fileDir = userDataDirectoryPath + "/documents/" + etherAddress + "/";


            //loop through the uploaded documents
            json.escrow.documents.forEach(function (document) {
                let uploadRequirements = requirementDocuments[document.requirementId];
                let idAttribute = uploadRequirements.attributeType;
                //if doc is removed or does not have idAttribute do nothing
                if (document.doc.removed || !idAttribute) {
                    return;
                }

                if (!attributes[idAttribute]) {
                    attributes[idAttribute] = [];
                }


                if (requirementDocuments[document.requirementId]) {
                    document.doc.files.forEach(function (file) {
                        let filePath = fileDir + file.fileName;
                        let obj = {
                            isDoc: true,
                            name: file.fileName,
                            contentType: file.contentType,
                            value: filePath,
                            addition: {
                                selfie: uploadRequirements.selfie,
                                ifEidIsSkipped: uploadRequirements.ifEidIsSkipped,
                                signature: uploadRequirements.signature,
                                optional: uploadRequirements.optional
                            }
                        };
                        //ensure the directory exists and save the file
                        fs.ensureDirSync(fileDir);
                        fs.writeFileSync(filePath, documentFiles[file.fileName].data);
                        attributes[idAttribute].push(obj);
                    });
                }
            })


            attributes.email = [{
                isDoc: false,
                value: json.user.email
            }];

            if (json.user.middleName) {
                attributes.name = [{
                    isDoc: false,
                    value: json.user.firstName + " " + json.user.middleName + " " + json.user.lastName
                }]
            } else {
                attributes.name = [{
                    isDoc: false,
                    value: json.user.firstName + " " + json.user.lastName
                }]
            }

            attributes.public_key = [{
                isDoc: false,
                value: etherAddress
            }];

            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, attributes);
        }).catch(function (err) {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, err, {});
        });
    }

    /*
    controller.prototype.importEtherKeystoreFile = function (event, actionId, actionName, args) {
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

                            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                                publicKey: keystoreObject.address,
                                keystoreObject: keystoreObject
                            });
                        } else {
                            app.win.webContents.send(RPC_METHOD, actionId, actionName, err, null);
                        }
                    });
                } else {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                        publicKey: keystoreObject.address,
                        keystoreObject: keystoreObject
                    });
                }
            });
        } catch (e) {
            log.error(e);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e.message, null);
        }
    }
    */

    /*
    controller.prototype.readKeystoreObject = function (event, actionId, actionName, args) {
        try {

            keythereum.importFromFile(path.normalize(args.filePath), function (keystoreObject) {
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

                            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                                publicKey: keystoreObject.address,
                                keystoreObject: keystoreObject
                            });
                        } else {
                            app.win.webContents.send(RPC_METHOD, actionId, actionName, err, null);
                        }
                    });
                } else {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                        publicKey: keystoreObject.address,
                        keystoreObject: keystoreObject
                    });
                }
            });
        } catch (e) {
            log.error(e);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e.message, null);
        }
    }
    */



    controller.prototype.installUpdate = function (event, actionId, actionName, args) {
        autoUpdater.quitAndInstall();
        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, true);
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

    controller.prototype.getTokenPrices = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.tokenPrices_selectAll().then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.saveWallet = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.wallets_insert(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getWallets = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.wallets_selectAll().then((data) => {
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

    controller.prototype.getTransactionsHistory = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.transactionsHistory_selectAll().then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getTransactionsHistoryByWalletId = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.transactionsHistory_selectByWalletId(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getTransactionsHistoryByWalletIdAndTokenId = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.transactionsHistory_selectByWalletIdAndTokenId(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getWalletSettingsByWalletId = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.walletSettings_selectByWalletId(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.saveWalletSettings = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.walletSettings_update(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.insertTransactionHistory = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.transactionsHistory_insert(args).then((data) => {
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
        electron.app.sqlLiteService.guideSettings_selectAll().then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.saveGuideSettings = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.guideSettings_update(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getIdAttributes = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.IdAttribute.findAllByWalletId(args.walletId).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
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

    controller.prototype.updateIdAttributeItemValueStaticData = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.idAttributeItemValues_updateStaticData(args).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.updateIdAttributeItemValueDocument = function (event, actionId, actionName, args) {
        let params = {
            id: args.idAttributeItemValue.id
        }

        params = Object.assign(params, args.document);

        electron.app.sqlLiteService.idAttributeItemValues_updateDocument(params).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    /**
     * IdAttribute
     */
    controller.prototype.addIdAttribute = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.IdAttribute.create(args.walletId, args.idAttributeType, args.staticData, args.file).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.deleteIdAttribute = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.IdAttribute.delete(args).then((data) => {
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


    return controller;
}
