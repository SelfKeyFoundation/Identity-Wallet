module.exports = function (app) {
    let controller = {};

    let dialog = app.modules.electron.dialog;
    let win = app.win;
    let path = app.modules.path;
    let keythereum = app.modules.keythereum;


    controller.readConfig = function (event, actionId, actionName, args) {
        const settings = require('electron-settings');
        console.log(args);
        // TODO: config name should be set somewhere
        settings.setPath(args.filepath + '/idwallet.json');
        const data = settings.getAll();
        app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, data );
    }

    controller.saveConfig = function (event, actionId, actionName, args) {
        const settings = require('electron-settings');
        // TODO: config name should be set somewhere
        settings.setPath(args.filepath + '/idwallet.json');
        const data = settings.setAll(args.data);
        app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, data );
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

    controller.createEthereumAddress = function (event, actionId, actionName, args) {
        const params = { keyBytes: 32, ivBytes: 16 };
        var dk = keythereum.create(params);

        // asynchronous
        keythereum.create(params, function (dk) {
            console.log(dk);

            var options = {
                kdf: "pbkdf2",
                cipher: "aes-128-ctr",
                kdfparams: {
                    c: 262144,
                    dklen: 32,
                    prf: "hmac-sha256"
                }
            };

            var keyObject = keythereum.dump(args.password, dk.privateKey, dk.salt, dk.iv, options);
            keythereum.exportToFile(keyObject, args.dest);

            console.log("createEthereumAddress", keyObject);

            app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, keyObject);
        });
    }

    controller.importEthereumAddress = function (event, actionId, actionName, args) {
        keythereum.importFromFile(args.address, args.dataDir, function (keyObject) {
            console.log("importEthereumAddress", keyObject);

            // TODO
            var privateKey = keythereum.recover(password, keyObject);

            app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, null, keyObject);
        });
    }

    return controller;
}