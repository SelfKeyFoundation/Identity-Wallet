module.exports = {
    run: function (app, next) {
        let path = app.modules.path;

        app.modules.electron.ipcMain.on(app.events.ON_CONFIG_READY, (event, userConfig) => {
            console.log('ON_CONFIG_READY', userConfig);
            app.config.user = userConfig
        });

        app.modules.electron.ipcMain.on('ON_CONFIG_CHANGE', (event, userConfig) => {
            console.log('ON_CONFIG_CHANGE', userConfig);
            app.config.user = userConfig
        });

        app.modules.electron.ipcMain.on('ON_ASYNC_REQUEST', (event, actionId, actionName, args) => {
            console.log('ON_ASYNC_REQUEST', actionId, actionName);
            switch (actionName) {
                case 'CHECK_FILE_STAT':
                    app.controllers.asyncRequestHandler.checkFileStat(event, actionId, actionName, args);
                    break;
                case 'OPEN_DIRECTORY_SELECT_DIALOG':
                console.log("??????");
                    app.controllers.asyncRequestHandler.openDirectorySelectDialog(event, actionId, actionName, args);
                    break;
                default:
            }
        });

        // TODO - move into 'ON_ASYNC_REQUEST'
        /*
        app.modules.electron.ipcMain.on(app.events.ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE_REQUEST, (event) => {
            console.log('ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE_REQUEST');

            // TODO - take strings from DICTIONARY
            let dialogConfig = {
                title: 'Choose where to save documents',
                message: 'Choose where to save documents',
                properties: ['openDirectory']
            };

            app.modules.electron.dialog.showOpenDialog(app.win, dialogConfig, (filePaths) => {
                if (filePaths) {
                    app.win.webContents.send(app.events.ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE, filePaths[0]);
                }
            });
        });
        */

        // TODO - move into 'ON_ASYNC_REQUEST'
        app.modules.electron.ipcMain.on('MOVE_FILE', (event, args) => {
            console.log(args.src, args.dest);
            console.log(path.basename(args.src), '????')
            args.dest += '/' + path.basename(args.src);

            console.log(app.controllers, "<<<<<<<<")

            app.controllers.helpers.copyFile(args.src, args.dest, (err) => {
                app.win.webContents.send('MOVE_FILE', err, args.dest);
            });
        });

        // TODO - move into 'ON_ASYNC_REQUEST'
        app.modules.electron.ipcMain.on('CHOOSE_FILE_PATH', (event) => {
            // TODO - take strings from DICTIONARY
            let dialogConfig = {
                title: 'Choose document',
                message: 'Choose document',
                properties: ['openFile']
            };

            app.modules.electron.dialog.showOpenDialog(app.win, dialogConfig, (filePaths) => {
                console.log('filePaths', filePaths);
                if (filePaths) {
                    app.win.webContents.send('CHOOSE_FILE_PATH', filePaths[0]);
                } else {
                    app.win.webContents.send('CHOOSE_FILE_PATH', null);
                }
            });
        });

        next();
    }
};