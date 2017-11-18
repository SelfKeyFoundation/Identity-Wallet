module.exports = function (app) {
    let controller = {};

    let dialog = app.modules.electron.dialog;
    let win = app.win;
    let path = app.modules.path;
    let keythereum = app.modules.keythereum;
    let EthereumTx = app.modules['ethereumjs-tx'];


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

            let keyObject = keythereum.dump(args.password, dk.privateKey, dk.salt, dk.iv, options);
            keythereum.exportToFile(keyObject, args.keyStoreSrc);

            console.log("createEthereumAddress", keyObject);

            app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, keyObject);
        });
    }

    controller.importEtherKeystoreFile = function (event, actionId, actionName, args) {
        try {
            keythereum.importFromFile(args.filePath, function (keyObject) {
                console.log("importEtherKeystoreFile", keyObject);
                app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, keyObject);
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
            if(privateKey){
                app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, privateKey);
            }else{
                app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, {message: "authentication code mismatch"}, null);
            }
            
        } catch (e) {
            app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, {message: "authentication code mismatch"}, null);
        }
    }

    // TODO remove
    controller.unlockEthereumWallet = function (event, actionId, actionName, args) {
        console.log("unlockEthereumWallet", args);
        let privateKey = keythereum.recover(args.password, args.keyObject);
        app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, privateKey);
    }

    controller.testCustomNode = function (event, actionId, actionName, args) {
        console.log("testCustomNode", args);
        app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, { "test": "test" });
    }

    controller.generateRawTransaction = function (event, actionId, actionName, args) {
        console.log("generateRawTransaction", args);

        const privateKey = Buffer.from(args.privateKey, 'hex') // f48194b05b5f927d392d6bd95da255f71ad486a6e5738c50fba472ad16b77fe1

        let txParams = {
            nonce: args.nonce, // 0
            gasPrice: args.gasPrice, // 0
            gasLimit: args.gasLimit, // 21000
            to: args.to, //'0x603fc6DAA3dBB1e052180eC91854a7D6Af873fdb', 
            value: args.value, // 10000000000000000
            // EIP 155 chainId - mainnet: 1, ropsten: 3 
            chainId: args.chainId || 1
        }

        if(args.data){
            txParams.data = args.data
        }

        console.log("TX Data", txParams);

        const tx = new EthereumTx(txParams)
        tx.sign(privateKey);

        const serializedTx = tx.serialize().toString('hex');
        console.log(serializedTx.toString('hex'));

        app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, { "serializedTx": serializedTx });
    }

    return controller;
}