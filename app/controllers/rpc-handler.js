'use strict';

const electron = require('electron');
const { dialog, Notification, shell, autoUpdater } = require('electron');

const path = require('path');
const keythereum = require('../extended_modules/keythereum');
const deskmetrics = require('deskmetrics');
const mime = require('mime-types');
const settings = require('electron-settings');
const fs = require('fs-extra');
const ethereumjsUtil = require('ethereumjs-util');
const decompress = require('decompress');
const os = require('os');

const RPC_METHOD = "ON_RPC";

module.exports = function (app) {
    const helpers = require('./helpers')(app);
    const controller = function () {
    };

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
        reminders: [],
        alerts: []
    };

    console.log(userDataDirectoryPath);

    controller.prototype.readDataStore = function (event, actionId, actionName, args) {
        let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);

        settings.setPath(storeFilePath);

        const data = settings.getAll();
        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
    }

    controller.prototype.saveDataStore = function (event, actionId, actionName, args) {
        let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);

        settings.setPath(storeFilePath);

        const data = settings.setAll(args.data);
        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
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
                    key: {
                        type: 'custom',
                        lastBalance: 0,
                        contract: {
                            address: "0x4cc19356f2d37338b9802aa8e8fc58b0373296e7",		// mainnet: 0x4cc19356f2d37338b9802aa8e8fc58b0373296e7 | testnet: 0x28eb857a2aee4b49fd45f163875dd5ef76e16394
                            symbol: "KEY",
                            decimal: 18,
                            type: "default"
                        }
                    }
                },
                wallets: {}
            });
        }

        const storeData = settings.getAll();
        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, storeData);
    }

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

    // TODO - ??
    controller.prototype.createDirectory = function (event, actionId, actionName, args) {
        fs.mkdir(path.resolve(walletsDirectoryPath, args.publickKey));
        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, storeData);
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

                        if (args.maxFileSize) {
                            if (stats.size > args.maxFileSize) {
                                return app.win.webContents.send(RPC_METHOD, actionId, actionName, 'file_size_error', null);
                            }
                        }

                        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                            name: name,
                            mimeType: mimeType,
                            path: filePaths[0],
                            size: stats.size
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
                app.win.webContents.send(RPC_METHOD, actionId, actionName, 'error', null);
            } else {
                let data = stdout.toString().split('\n')[0];
                app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
            }
        });
    }

    controller.prototype.moveFile = function (event, actionId, actionName, args) {
        args.dest += '/' + path.basename(args.src);
        if (args.copy) {
            helpers.copyFile(args.src, args.dest, (err) => {
                if (!err) {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, null, args.dest);
                } else {
                    app.win.webContents.send(RPC_METHOD, actionId, actionName, err, null);
                }
            });
        } else {
            // TODO
            app.win.webContents.send(RPC_METHOD, actionId, actionName, 'not implemented yet', null);
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

            electron.app.sqlLiteService.wallets_insert(
                {
                    publicKey: keystoreObject.address,
                    keystoreFilePath: outputPath
                },
                args.basicInfo
            ).then((resp)=>{
                let privateKey = keythereum.recover(args.password, keystoreObject);
                app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                    id: resp.id,
                    publicKey: keystoreObject.address,
                    privateKey: privateKey,
                    keystoreFilePath: outputPath
                });
            }).catch((error)=>{
                console.log(error);
                app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
            });

            /*
            // TODO remove
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
            */


        });
    }

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
            console.log(e.message);
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
            console.log(">>>>>>>", e);
            app.win.webContents.send(RPC_METHOD, actionId, actionName, "authentication code mismatch", null);
        }
    }

    controller.prototype.importEtherPrivateKey = function (event, actionId, actionName, args) {
        try {
            let publicKey = ethereumjsUtil.privateToAddress(args.privateKey);
            publicKey = publicKey.toString('hex');

            let privateKeyBuffer = Buffer.from(args.privateKey.replace("0x", ""), "hex")

            let storeFilePath = path.resolve(userDataDirectoryPath, storeFileName);
            settings.setPath(storeFilePath);

            let storeData = settings.getAll();

            if (!storeData.wallets[publicKey]) {
                storeData.wallets[publicKey] = {
                    type: "pk",
                    name: "Unnamed Wallet",
                    data: initialStoreDataStructure
                }
                settings.setAll(storeData);
            }

            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, {
                privateKey: args.privateKey,
                privateKeyBuffer: privateKeyBuffer,
                publicKey: publicKey
            });
        } catch (e) {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, e.message, null);
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

    controller.prototype.analytics = function (event, actionId, actionName, args) {
        deskmetrics.send(args.event, args.data);
        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, true);
    }

    controller.prototype.openBrowserWindow = function (event, actionId, actionName, args) {
        shell.openExternal(args.url);
        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, true);
    }

    controller.prototype.installUpdate = function (event, actionId, actionName, args) {
        autoUpdater.quitAndInstall();
        app.win.webContents.send(RPC_METHOD, actionId, actionName, null, true);
    }

    /**
     * SQL Lite
     */
    controller.prototype.getIdAttributeTypes = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.idAttributeTypes_selectAll().then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }

    controller.prototype.getTokens = function (event, actionId, actionName, args) {
        electron.app.sqlLiteService.tokens_selectAll().then((data) => {
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
        electron.app.sqlLiteService.countries_selectAll().then((data) => {
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
        electron.app.sqlLiteService.idAttributes_selectAll(args.walletId).then((data) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, null, data);
        }).catch((error) => {
            app.win.webContents.send(RPC_METHOD, actionId, actionName, error, null);
        });
    }








    return controller;
}
