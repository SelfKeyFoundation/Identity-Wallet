/* istanbul ignore file */
/* global __static */
import electron, { Menu } from 'electron';
import path from 'path';
import { isDevMode, isDebugMode } from 'common/utils/common';
import { Logger } from '../common/logger';
import createMenuTemplate from './menu';
import { initSplashScreen } from '@trodi/electron-splashscreen';
import { getGlobalContext } from 'common/context';

const log = new Logger('main-window');

export const createMainWindow = async () => {
	const windowOptions = {
		id: 'main-window',
		title: electron.app.getName(),
		width: +process.env.WINDOW_WIDTH || 1170,
		height: +process.env.WINDOW_HEIGHT || 800,
		minWidth: +process.env.WINDOW_MIN_WIDTH || 1170,
		minHeight: +process.env.WINDOW_MIN_HEIGHT || 600,
		kiosk: !!process.env.WINDOW_KIOSK_MODE || false,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: true,
			disableBlinkFeatures: 'Auxclick',
			preload: path.resolve(__dirname, 'preload.js'),
			zoomFactor: +process.env.WINDOW_ZOOM_FACTOR || 1
		},
		icon: __static + '/assets/icons/png/newlogo-256x256.png'
	};

	let mainWindow = initSplashScreen({
		windowOpts: windowOptions,
		templateUrl: path.join(__static, '/splash-screen.html'),
		delay: 0,
		minVisible: 1500,
		splashScreenOpts: {
			height: process.env.WINDOW_HEIGHT || 800,
			width: process.env.WINDOW_WIDTH || 1170,
			transparent: true
		}
	});

	Menu.setApplicationMenu(Menu.buildFromTemplate(createMenuTemplate(mainWindow)));

	const webAppPath =
		isDevMode() && process.env.NODE_ENV !== 'production'
			? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/index.html`
			: `file://${__dirname}/index.html`;

	mainWindow.loadURL(webAppPath);

	mainWindow.setMenu(null); // in order to don't show electron default menu bar

	if (isDebugMode()) {
		log.debug('app is running in debug mode');
		mainWindow.webContents.openDevTools();
	}

	if (process.env.FULL_SCREEN) {
		log.debug('app is running in full screen mode');
		mainWindow.setFullScreen(true);
	}

	if (
		isDevMode() &&
		process.env.NODE_ENV !== 'production' &&
		process.argv.indexOf('--noDevServer') === -1 &&
		process.env.ENABLE_EXTENSIONS
	) {
		const installer = require('electron-devtools-installer');
		const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
		const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

		await Promise.all(
			extensions.map(name => installer.default(installer[name], forceDownload))
		);
	}

	mainWindow.once('ready-to-show', () => {
		mainWindow.webContents.setZoomFactor(+process.env.WINDOW_ZOOM_FACTOR || 1);
		mainWindow.show();
	});

	mainWindow.on('close', event => {
		getGlobalContext().matomoService.trackEvent('app', 'close', undefined, undefined, true);
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	return mainWindow;
};
