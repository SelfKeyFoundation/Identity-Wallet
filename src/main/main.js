/* istanbul ignore file */
/* global __static */
'use strict';
import '@babel/polyfill';
import path from 'path';
import fs from 'fs';
import electron from 'electron';
import { localeUpdate } from 'common/locale/actions';
import { fiatCurrencyUpdate } from 'common/fiatCurrency/actions';
import { Logger } from '../common/logger';
import db from './db/db';
import { identityOperations } from '../common/identity';
import { pricesOperations } from '../common/prices';
import { getUserDataPath, isDevMode, isTestMode, getWalletsDir } from 'common/utils/common';
import config from 'common/config';
import { configureContext, setGlobalContext, getGlobalContext } from '../common/context';
import { handleSquirrelEvent } from './squirrelevent';
import { createMainWindow } from './main-window';
import { asValue } from 'awilix';
import { featureIsEnabled } from 'common/feature-flags';
import { loadIdvOcr } from '../idv-ocr/weights';

const log = new Logger('main');

log.info('starting: %s', electron.app.getName());

const userDataDirectoryPath = getUserDataPath();
const walletsDirectoryPath = getWalletsDir();
const documentsDirectoryPath = path.resolve(userDataDirectoryPath, 'documents');

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
	electron.app.on('activate', onReady());
	electron.app.on('web-contents-created', onWebContentsCreated);
	electron.app.on('ready', onReady());
}

const gotTheLock = electron.app.requestSingleInstanceLock();

if (!gotTheLock) {
	electron.app.quit();
} else {
	electron.app.on('second-instance', (event, commandLine, workingDirectory) => {
		// Someone tried to run a second instance, we should focus our window.
		if (electron.app.win) {
			if (electron.app.win.isMinimized()) electron.app.win.restore();
			electron.app.win.focus();
		}
	});
}

function onReady() {
	return async () => {
		let ctx = getGlobalContext();
		if (ctx && ctx.app.win) return;
		global.__static = __static;
		await db.init();
		const container = configureContext('main');
		ctx = container.cradle;
		setGlobalContext(ctx);
		const store = ctx.store;
		const app = ctx.app;
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
		ctx.priceService.on('pricesUpdated', newPrices => {
			ctx.store.dispatch(pricesOperations.updatePrices(newPrices));
		});
		ctx.stakingService.acquireContract();

		createKeystoreFolder();

		if (electron.app.dock) {
			electron.app.dock.setIcon(__static + '/assets/icons/png/newlogo-256x256.png');
		}

		let mainWindow = (app.win = createMainWindow());

		container.register({
			mainWindow: asValue(mainWindow)
		});

		mainWindow.webContents.on('did-finish-load', async () => {
			try {
				log.info('did-finish-load');
				mainWindow.webContents.send('APP_START_LOADING');
				ctx.networkService.start();
				// start update cmc data
				Promise.all([
					ctx.priceService.startUpdateData(),
					ctx.exchangesService.loadExchangeData(),
					ctx.tokenService.loadTokens(),
					loadIdentity(ctx)
				]);
				if (featureIsEnabled('scheduler')) {
					registerJobHandlers(ctx);
					scheduleInitialJobs(ctx);
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

async function loadIdentity(ctx) {
	// TODO, this probably should be initialized in root of react app
	await ctx.store.dispatch(identityOperations.loadRepositoriesOperation());
	try {
		// TODO: should be in update manager
		await ctx.store.dispatch(identityOperations.updateExpiredRepositoriesOperation());
	} catch (error) {
		log.error('failed to update repositories from remote %s', error);
	}
	await ctx.store.dispatch(identityOperations.loadIdAttributeTypesOperation());
	try {
		// TODO: should be in update manager
		await ctx.store.dispatch(identityOperations.updateExpiredIdAttributeTypesOperation());
	} catch (error) {
		log.error('failed to update id attribute types from remote %s', error);
	}
	await ctx.store.dispatch(identityOperations.loadUiSchemasOperation());
	try {
		// TODO: should be in update manager
		await ctx.store.dispatch(identityOperations.updateExpiredUiSchemasOperation());
	} catch (error) {
		log.error('failed to update ui schemas from remote %s', error);
	}
	try {
		// Load face-api weights
		await loadIdvOcr();
	} catch (error) {
		log.error(
			`failed to load identity verification models and weights\n:${JSON.stringify(
				error
			)}\n%s`,
			error
		);
	}
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
		fs.mkdir(walletsDirectoryPath, error => {
			if (error) log.error(error);
		});
	}

	if (!fs.existsSync(documentsDirectoryPath)) {
		fs.mkdir(documentsDirectoryPath, error => {
			if (error) log.error(error);
		});
	}
}

function registerJobHandlers(ctx) {
	ctx.vendorSyncJobHandler.registerHandler();
	ctx.inventorySyncJobHandler.registerHandler();
	ctx.marketplaceCountrySyncJobHandler.registerHandler();
	ctx.taxTreatiesSyncJobHandler.registerHandler();
}

function scheduleInitialJobs(ctx) {
	ctx.inventoryService.start();
	ctx.vendorService.start();
	ctx.marketplaceCountryService.start();
	ctx.taxTreatiesService.start();
}
