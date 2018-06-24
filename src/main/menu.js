const electron = require('electron');
const path = require('path');
const version = electron.app.getVersion();
/**
 * Create the Application's main menu
 */
const getMenuTemplate = mainWindow => {
	let isOnFullScreen = false;
	const defaultMenu = [
		{
			label: electron.app.getName(),
			submenu: [
				{
					label: 'About',
					click() {
						let win = new electron.BrowserWindow({
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
								preload: path.resolve(__dirname, 'preload.js')
							}
						});

						win.setMenu(null);

						win.webContents.on('did-finish-load', () => {
							win.webContents.send('version', version);
						});

						win.on('closed', () => {
							win = null;
						});

						win.loadURL(`file://${__static}/about.html`);
					}
				},
				{ label: 'Quit', role: 'quit' }
			]
		},
		{
			label: 'Edit',
			submenu: [
				{ label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
				{ label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
				{ type: 'separator' },
				{ label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
				{ label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
				{ label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
				{ label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Enter/Exit Full Screen',
					role: 'devtools',
					click() {
						isOnFullScreen = !isOnFullScreen;
						mainWindow.setFullScreen(isOnFullScreen);
					}
				}
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
		});
	}

	return defaultMenu;
};

module.exports = getMenuTemplate;
