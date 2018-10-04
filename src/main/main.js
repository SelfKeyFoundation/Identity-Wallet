/* istanbul ignore file */
/* global __static */
'use strict';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import isOnline from 'is-online';
import ChildProcess from 'child_process';
import electron, { Menu } from 'electron';
import configureStore from 'common/store/configure-store';
import { localeUpdate } from 'common/locale/actions';
import { fiatCurrencyUpdate } from 'common/fiatCurrency/actions';
import { Logger } from '../common/logger';
import {
	getUserDataPath,
	isDevMode,
	isDebugMode,
	isTestMode,
	getWalletsDir
} from 'common/utils/common';
import config from 'common/config';
import createMenuTemplate from './menu';
import db from './db/db';
import { setGlobalContext, configureContext } from 'common/context';

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

const app = {
	dir: {
		root: path.join(__dirname, '..'),
		desktopApp: path.join(__dirname, '..', 'app')
	},
	config: {
		app: config,
		user: null
	},
	translations: {},
	win: {},
	log: log
};

const i18n = ['en'];

let shouldIgnoreClose = true;
let shouldIgnoreCloseDialog = false; // in order to don't show prompt window
let mainWindow;

for (let i in i18n) {
	app.translations[i18n[i]] = require(`../common/locale/i18n/${i18n[i]}.js`);
}

if (!handleSquirrelEvent()) {
	electron.app.on('window-all-closed', onWindowAllClosed());
	electron.app.on('activate', onActivate(app));
	electron.app.on('web-contents-created', onWebContentsCreated);
	electron.app.on('ready', onReady(app));
}

let isSecondInstance = electron.app.makeSingleInstance((commandLine, workingDirectory) => {
	// Someone tried to run a second instance, we should focus our window.
	if (app.win && Object.keys(app.win).length) {
		if (app.win.isMinimized()) app.win.restore();
		app.win.focus();
	}
	return true;
});

/**
 *
 */
function onReady(app) {
	return async () => {
		global.__static = __static;
		if (isSecondInstance) {
			log.warn('another instance of the app is running, quiting');
			electron.app.quit();
			return;
		}
		if (!isDevMode() && !isTestMode()) {
			// Initate auto-updates
			const { appUpdater } = require('./autoupdater');
			appUpdater();
		}
		await db.init();
		const store = configureStore(global.state, 'main');
		const ctx = configureContext(store, app).cradle;
		setGlobalContext(ctx);

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
			if (shouldIgnoreCloseDialog) {
				shouldIgnoreCloseDialog = false;
				return;
			}
			if (shouldIgnoreClose) {
				event.preventDefault();
				shouldIgnoreClose = false;
				mainWindow.webContents.send('SHOW_CLOSE_DIALOG');
			}
		});

		mainWindow.on('closed', () => {
			mainWindow = null;
		});

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
				await ctx.idAttributeTypeService.resolveSchemas();
				ctx.txHistoryService.startSyncingJob();
				mainWindow.webContents.send('APP_SUCCESS_LOADING');
			} catch (error) {
				log.error(error);
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
			shouldIgnoreClose = true;
		});

		electron.ipcMain.on('ON_IGNORE_CLOSE_DIALOG', event => {
			shouldIgnoreCloseDialog = true;
		});

		// TODO: Refactor this away
		app.win = mainWindow;
		if (isDevMode() && process.env.ENABLE_STAKING_TEST === '1') {
			startStakingTest(ctx);
		}
	};
}

function onActivate(app) {
	log.info('onActivate');
	return function() {
		if (app.win === null) {
			onReady(app);
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

/**
 *
 */
function handleSquirrelEvent() {
	log.info('started handleSquirrelEvent');

	if (process.argv.length === 1) {
		return false;
	}

	const appFolder = path.resolve(process.execPath, '..');
	const rootAtomFolder = path.resolve(appFolder, '..');
	const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
	const exeName = 'Identity-Wallet-Installer.exe';

	const spawn = function(command, args) {
		let spawnedProcess;

		try {
			spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
		} catch (error) {
			log.error(error);
		}

		return spawnedProcess;
	};

	const spawnUpdate = function(args) {
		return spawn(updateDotExe, args);
	};

	const squirrelEvent = process.argv[1];
	switch (squirrelEvent) {
		case '--squirrel-install':
		case '--squirrel-updated':
			// Optionally do things such as:
			// - Add your .exe to the PATH
			// - Write to the registry for things like file associations and
			//   explorer context menus

			// Install desktop and start menu shortcuts
			spawnUpdate(['--createShortcut', exeName]);

			setTimeout(electron.app.quit, 1000);
			return true;

		case '--squirrel-uninstall':
			// Undo anything you did in the --squirrel-install and
			// --squirrel-updated handlers

			// Remove desktop and start menu shortcuts
			spawnUpdate(['--removeShortcut', exeName]);

			setTimeout(electron.app.quit, 1000);
			return true;

		case '--squirrel-obsolete':
			// This is called on the outgoing version of your app before
			// we update to the new version - it's the opposite of
			// --squirrel-updated

			electron.app.quit();
			return true;
	}
	log.info('end handleSquirrelEvent');
}

function startStakingTest(ctx) {
	let store = ctx.store;
	let unlocked = false;
	log.info('starting staking test');
	store.subscribe(async () => {
		let state = store.getState();
		if (unlocked) return;
		if (!state.wallet || !state.wallet.privateKey) return;
		let { wallet } = state;
		unlocked = true;
		let { stakingService, web3Service } = ctx;
		try {
			await stakingService.acquireContract();
			const serviceOwner = web3Service.web3.utils.toHex(0);
			let decimals = await stakingService.tokenContract.call({
				method: 'decimals'
			});
			let BN = require('bignumber.js');

			const sendAmount = new BN(100).times(new BN(10).pow(decimals)).toString();
			const serviceId = web3Service.web3.utils.toHex('test');
			const sourceAddress = '0x' + wallet.publicKey;
			const options = { from: sourceAddress };
			log.info('active contract %2j', stakingService.activeContract.address);

			let allowance = await stakingService.tokenContract.allowance(
				stakingService.activeContract.address,
				options
			);
			log.info('allowance %s', allowance);

			let info = await stakingService.getStakingInfo(serviceOwner, serviceId, options);
			log.info('Staking initial balance %2j', _.omit(info, 'contract'));

			let lockPeriod = await stakingService.activeContract.getLockPeriod(
				serviceOwner,
				serviceId,
				options
			);
			log.info('Staking lock period %2j', lockPeriod);

			let depositRes = await stakingService.placeStake(
				sendAmount,
				serviceOwner,
				serviceId,
				options
			);
			log.info('deposite res %2j', depositRes);

			try {
				let withdrawRes = await stakingService.withdrawStake(
					serviceOwner,
					serviceId,
					options
				);
				log.info('withdraw res %2j', withdrawRes);
			} catch (error) {
				log.error('withdraw error %s', error);
			}
		} catch (error) {
			log.error('staking error %s', error);
		}
	});
}
