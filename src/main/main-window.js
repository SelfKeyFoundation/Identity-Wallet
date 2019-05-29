/* istanbul ignore file */
/* global __static */
import electron, { Menu } from 'electron';
import path from 'path';
import { isDevMode, isDebugMode } from 'common/utils/common';
import { Logger } from '../common/logger';
import createMenuTemplate from './menu';
import { getGlobalContext } from 'common/context';
import { push } from 'connected-react-router';
import { initSplashScreen } from '@trodi/electron-splashscreen';

const log = new Logger('main-window');

export const createMainWindow = () => {
	const windowOptions = {
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
	};

	let mainWindow = initSplashScreen({
		windowOpts: windowOptions,
		templateUrl: path.join(__static, '/splash-screen.html'),
		delay: 0,
		minVisible: 1500,
		splashScreenOpts: {
			height: 800,
			width: 1170,
			transparent: true
		}
	});

	mainWindow.shouldIgnoreClose = true;
	mainWindow.shouldIgnoreCloseDialog = false; // in order to don't show prompt window

	Menu.setApplicationMenu(Menu.buildFromTemplate(createMenuTemplate(mainWindow)));

	const webAppPath = isDevMode()
		? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/index.html`
		: `file://${__dirname}/index.html`;

	mainWindow.loadURL(webAppPath);

	mainWindow.setMenu(null); // in order to don't show electron default menu bar

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
