const electron = require('electron');
const path = require('path');

/**
 * Create the Application's main menu
 */
const getMenuTemplate = (mainWindow) => {
    const defaultMenu = [
        {
            label: electron.app.getName(),
            submenu: [
                {
                    label: "About", role: 'about',
                    click() {
                        const win = new electron.BrowserWindow({
                            width: 600,
                            height: 300,
                            resizable: false,
                            minimizable: false,
                            maximizable: false,
                            fullscreen: false,
                            center: true,
                            parent: mainWindow,
                            webPreferences: {
                                nodeIntegration: false,
                                webSecurity: true,
                                disableBlinkFeatures: 'Auxclick',
                                devTools: false,
                                preload: path.resolve('./preload.js')
                            },
                        });

                        win.webContents.on('did-finish-load', () => {
                            win.webContents.send('version', version)
                        });

                        win.on('closed', () => {
                            win = null
                        });

                        win.loadURL(url.format({
                            pathname: path.resolve(__dirname, '../../app/src/about.html'),
                            protocol: 'file:',
                            slashes: true
                        }));
                    }
                },
                { label: "Quit", role: 'quit' }
            ]
        },
        {
            label: "Edit",
            submenu: [
                { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
                { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
                { type: "separator" },
                { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
            ]
        }
    ];

    if (['debug', 'development'].indexOf(process.env.NODE_ENV) >= 0) {
        defaultMenu.push({
            label: 'Development',
            submenu: [
                {
                    label: 'Open Developer Tools',
                    role: 'devtools',
                    click() {
                        mainWindow.webContents.openDevTools();
                    }
                }
            ]
        })
    }

    return defaultMenu;
};

module.exports = getMenuTemplate;