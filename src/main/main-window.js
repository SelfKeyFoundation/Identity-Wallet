/* istanbul ignore file */
/* global __static */
import electron, { Menu } from 'electron';
import path from 'path';
import { isDevMode, isDebugMode } from 'common/utils/common';
import { Logger } from '../common/logger';
import createMenuTemplate from './menu';

const log = new Logger('main-window');

export const createMainWindow = () => {
	let mainWindow;

	mainWindow = new electron.BrowserWindow({
		id: 'main-window',
		title: electron.app.getName(),
		width: 1170,
		height: 800,
		minWidth: 1170,
		minHeight: 800,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: true,
			disableBlinkFeatures: 'Auxclick',
			preload: path.resolve(__dirname, 'preload.js')
		},
		icon: __static + '/assets/icons/png/newlogo-256x256.png'
	});

	mainWindow.shouldIgnoreClose = true;
	mainWindow.shouldIgnoreCloseDialog = false; // in order to don't show prompt window

	Menu.setApplicationMenu(Menu.buildFromTemplate(createMenuTemplate(mainWindow)));

	const webAppPath = isDevMode()
		? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/index.html`
		: `file://${__dirname}/index.html`;

	mainWindow.loadURL(webAppPath);

	if (isDebugMode()) {
		log.info('app is running in debug mode');
		mainWindow.webContents.openDevTools();
	}

	mainWindow.on('close', event => {
		if (mainWindow.shouldIgnoreCloseDialog) {
			mainWindow.shouldIgnoreCloseDialog = false;
			return;
		}
		if (mainWindow.shouldIgnoreClose) {
			event.preventDefault();
			mainWindow.shouldIgnoreClose = false;
			mainWindow.webContents.send('SHOW_CLOSE_DIALOG');
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	return mainWindow;
};
