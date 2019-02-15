/* istanbul ignore file */
/* global __static */
import electron, { Menu } from 'electron';
import path from 'path';
import { isDevMode, isDebugMode } from 'common/utils/common';
import { Logger } from '../common/logger';
import createMenuTemplate from './menu';
import { getGlobalContext } from 'common/context';
import { push } from 'connected-react-router';

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

	if (isDevMode() && process.argv.indexOf('--noDevServer') === -1) {
		const installer = require('electron-devtools-installer');
		const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
		const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS', 'DEVTRON'];

		extensions.map(name => installer.default(installer[name], forceDownload));
	}

	mainWindow.on('close', event => {
		if (mainWindow.shouldIgnoreCloseDialog) {
			mainWindow.shouldIgnoreCloseDialog = false;
			return;
		}
		if (mainWindow.shouldIgnoreClose) {
			event.preventDefault();
			mainWindow.shouldIgnoreClose = false;
			const store = getGlobalContext().store;
			store.dispatch(push('/closeConfirmation'));
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	return mainWindow;
};
