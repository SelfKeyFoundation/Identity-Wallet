/* istanbul ignore file */
/* global __static */
import fs from 'fs';
import electron from 'electron';
import path from 'path';
import { download } from 'electron-dl';
import { Logger } from 'common/logger';

const log = new Logger('Menu');
const version = electron.app.getVersion();
/**
 * Create the Application's main menu
 */
const getMenuTemplate = mainWindow => {
	log.debug('generating menu template');
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
								enableRemoteModule: true,
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
					role: 'toggleFullScreen'
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
	defaultMenu.push({
		label: 'Help',
		submenu: [
			{
				label: 'Issue Reproduction Mode',
				click() {
					log.overrideGlobalLogLevel('info');
					log.warn('SUPPORT: ISSUE REPRODUCTION STARTS HERE');
				}
			},
			{
				label: 'Export Log File',
				async click() {
					const logPath = log.getLogFilePath();
					if (!fs.existsSync(logPath)) {
						log.error('log file does not exist');
						return;
					}
					try {
						await download(mainWindow, `file://${logPath}`, {
							saveAs: true,
							filename: 'selfkey-identity-wallet.log'
						});
					} catch (error) {
						log.error(error);
					}
				}
			}
		]
	});

	return defaultMenu;
};

export default getMenuTemplate;
