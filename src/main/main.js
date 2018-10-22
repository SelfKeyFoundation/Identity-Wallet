/* istanbul ignore file */
/* global __static */
'use strict';
import path from 'path';
import fs from 'fs';
import isOnline from 'is-online';
import electron from 'electron';
import { localeUpdate } from 'common/locale/actions';
import { fiatCurrencyUpdate } from 'common/fiatCurrency/actions';
import { Logger } from '../common/logger';
import db from './db/db';
import { getUserDataPath, isDevMode, isTestMode, getWalletsDir } from 'common/utils/common';
import config from 'common/config';
import { configureContext, setGlobalContext } from '../common/context';
import { createMainWindow } from './main-window';
import { handleSquirrelEvent, appUpdater } from './autoupdater';

const log = new Logger('main');

log.info('starting: %s', electron.app.getName());

const userDataDirectoryPath = getUserDataPath();
const walletsDirectoryPath = getWalletsDir();
const documentsDirectoryPath = path.resolve(userDataDirectoryPath, 'documents');

const ctx = configureContext('main').cradle;
setGlobalContext(ctx);

/**
 * auto updated
 */
process.on('unhandledRejection', err => {
	log.error('unhandled rejection, %s', err);
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	log.info('missing: electron-squirrel-startup');
	process.exit(0);
}

if (!handleSquirrelEvent()) {
	electron.app.on('window-all-closed', onWindowAllClosed());
	electron.app.on('activate', onActivate());
	electron.app.on('web-contents-created', onWebContentsCreated);
	electron.app.on('ready', onReady());
}

function onReady() {
	return async () => {
		global.__static = __static;
		const app = ctx.app;
		if (app.isSecondInstance) {
			log.warn('another instance of the app is running, quiting');
			electron.app.quit();
			return;
		}
		if (!isDevMode() && !isTestMode()) {
			appUpdater();
		}
		await db.init();
		const store = ctx.store;
		try {
			store.dispatch(localeUpdate('en'));
			store.dispatch(fiatCurrencyUpdate('USD'));
		} catch (e) {
			log.error('common/locale init error %s', e);
		}
		if (!isDevMode() && !isTestMode()) {
			await ctx.CrashReportService.startCrashReport();
		}
		app.config.userDataPath = electron.app.getPath('userData');
		ctx.lwsService.startServer();
		ctx.rpcHandler.startTokenPricesBroadcaster();
		ctx.rpcHandler.startTrezorBroadcaster();
		ctx.stakingService.acquireContract();

		createKeystoreFolder();

		// TODO
		// 1) load ETH & KEY icons & prices
		// 2) insert tokenPrices - set icon & price
		// 3) notify angular app when done

		if (electron.app.dock) {
			electron.app.dock.setIcon(__static + '/assets/icons/png/newlogo-256x256.png');
		}

		let mainWindow = (app.win = createMainWindow(ctx));
		mainWindow.webContents.on('did-finish-load', async () => {
			try {
				let online = await isOnline();
				log.info('is-online %s', online);
				if (!online) {
					mainWindow.webContents.send('SHOW_IS_OFFLINE_WARNING');
					return;
				}

				log.info('did-finish-load');
				mainWindow.webContents.send('APP_START_LOADING');
				// start update cmc data
				await Promise.all([
					ctx.priceService.startUpdateData(),
					ctx.idAttributeTypeService.loadIdAttributeTypes(),
					ctx.exchangesService.loadExchangeData()
				]);
				if (process.env.ENABLE_JSON_SCHEMA === '1') {
					await ctx.idAttributeTypeService.resolveSchemas();
				}
				ctx.txHistoryService.startSyncingJob();
				mainWindow.webContents.send('APP_SUCCESS_LOADING');
			} catch (error) {
				log.error('finish-load-error %s', error);
				mainWindow.webContents.send('APP_FAILED_LOADING');
			}
		});

		mainWindow.webContents.on('did-fail-load', () => {
			log.error('did-fail-load');
		});

		// TODO - check
		electron.ipcMain.on('ON_CONFIG_CHANGE', (event, userConfig) => {
			log.info('ON_CONFIG_CHANGE');
			app.config.user = userConfig;
		});

		electron.ipcMain.on('ON_RPC', (event, actionId, actionName, args) => {
			if (ctx.rpcHandler[actionName]) {
				log.debug('rpc %s, %2j', actionName, args);
				ctx.rpcHandler[actionName](event, actionId, actionName, args);
			}
		});

		electron.ipcMain.on('ON_CLOSE_DIALOG_CANCELED', event => {
			mainWindow.shouldIgnoreClose = true;
		});

		electron.ipcMain.on('ON_IGNORE_CLOSE_DIALOG', event => {
			mainWindow.shouldIgnoreCloseDialog = true;
		});
	};
}

function onActivate() {
	log.info('onActivate');
	const app = ctx.app;
	return function() {
		if (app.win === null) {
			onReady();
		}
	};
}

function onWindowAllClosed() {
	return () => {
		log.info('all windows closed, quitting');
		return electron.app.quit();
	};
}

function onWebContentsCreated(event, contents) {
	contents.on('will-attach-webview', (event, webPreferences, params) => {
		delete webPreferences.preload;
		delete webPreferences.preloadURL;

		// Disable node integration
		webPreferences.nodeIntegration = false;
		webPreferences.sandbox = true;

		let found = false;
		for (let i in config.common.allowedUrls) {
			if (params.src.startsWith(config.common.allowedUrls[i])) {
				found = true;
				break;
			}
		}

		if (!found) {
			return event.preventDefault();
		}
	});
}

function createKeystoreFolder() {
	if (!fs.existsSync(walletsDirectoryPath)) {
		fs.mkdir(walletsDirectoryPath);
	}

	if (!fs.existsSync(documentsDirectoryPath)) {
		fs.mkdir(documentsDirectoryPath);
	}
}
