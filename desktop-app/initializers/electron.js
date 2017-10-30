function createWindow(app, next) {
    return function () {
        app.win = new app.modules.electron.BrowserWindow({
            width: 1000,
            height: 800,
            minWidth: 1000,
            minHeight: 800,
            webPreferences: {
                devTools: true,
                preload: app.modules.path.join(app.dir.desktopApp, 'preload.js')
            },
            icon: app.modules.path.join(app.dir.root, 'assets/icons/png/256x256.png')
        });

        app.win.loadURL(app.modules.url.format({
            pathname: app.modules.path.join(app.dir.root, 'wallet-web-app/dist', 'index.html'),
            protocol: 'file:',
            slashes: true
        }));

        app.win.webContents.openDevTools();

        app.win.on('closed', () => {
            app.win = null
        });

        app.win.webContents.on('did-finish-load', () => {
            app.win.webContents.send('ON_READY');
        });

        next();
    }
}

module.exports = {
    run: function (app, next) {
        app.modules.electron.app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.modules.electron.app.quit()
            }
        });
        app.modules.electron.app.on('activate', () => {
            if (app.modules.electron.app.win === null) {
                createWindow(next)
            }
        });
        
        app.modules.electron.app.on('ready', createWindow(app, next));
    }
};