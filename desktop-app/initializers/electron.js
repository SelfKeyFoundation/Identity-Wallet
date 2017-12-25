function createWindow(app, next) {
    return function () {
        app.win = new app.modules.electron.BrowserWindow({
            width: 1160,
            height: 768,
            minWidth: 1160,
            minHeight: 768,
            webPreferences: {
                devTools: app.config.app.debug,
                preload: app.modules.path.join(app.dir.desktopApp, 'preload.js')
            },
            icon: app.modules.path.join(app.dir.root, 'assets/icons/png/256x256.png')
        });

        // If DEV loads electron source files from 'src' folder instead of 'dist' folder
        app.win.loadURL(app.modules.url.format({
            pathname: app.modules.path.join(app.dir.root, 'wallet-web-app/dist', 'index.html'),
            protocol: 'file:',
            slashes: true
        }));

        if (app.config.app.debug) {
            app.win.webContents.openDevTools();
        }

        app.win.maximize(); //todo move to configs

        app.win.on('closed', () => {
            app.win = null
        });

        app.win.webContents.on('did-finish-load', () => {
            app.win.webContents.send('ON_READY');
        });

        let deskmetrics = app.modules.deskmetrics;
        deskmetrics.start({ appId: app.config.deskmetricsAppId }).then(function() {
            deskmetrics.setProperty('version', app.pkg.version)
        });
        
        next();
    }
}

module.exports = {
    run: function (app, next) {

        /*
        app.modules.electron.app.on('window-all-closed', app.modules.electron.app.quit);
        app.modules.electron.app.on('before-quit', () => {
            app.win.removeAllListeners('close');
            app.win.close();
        });
        */

        app.modules.electron.app.on('window-all-closed', () => {
            //if (process.platform !== 'darwin') {
            app.modules.electron.app.quit()
            //}
        });

        app.modules.electron.app.on('activate', () => {
            if (app.modules.electron.app.win === null) {
                createWindow(app, next)
            }
        });

        //
        

        // self updater
        let autoUpdater = app.modules.electron['autoUpdater'];
        let dialog = app.modules.electron.dialog;

        /*
        const version = app.modules.electron.app.getVersion();
        const server = 'http://localhost:5000'
        const feed = `${server}/${process.platform}/${version}`
        
        autoUpdater.setFeedURL(feed)

        autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
            const dialogOpts = {
                type: 'info',
                buttons: ['Restart', 'Later'],
                title: 'Application Update',
                message: process.platform === 'win32' ? releaseNotes : releaseName,
                detail: 'A new version has been downloaded. Restart the application to apply the updates.'
            }

            dialog.showMessageBox(dialogOpts, (response) => {
                if (response === 0) autoUpdater.quitAndInstall()
            });
        });

        autoUpdater.on('error', message => {
            console.error('There was a problem updating the application')
            console.error(message)
        });

        setInterval(() => {
            autoUpdater.checkForUpdates()
        }, 10000);
        */

        app.modules.electron.app.on('ready', createWindow(app, next));
    }
};