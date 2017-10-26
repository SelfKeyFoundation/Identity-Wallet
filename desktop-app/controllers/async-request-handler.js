module.exports = function (app) {
    let controller = {};

    let dialog = app.modules.electron.dialog;
    let win = app.win;

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

    return controller;
}