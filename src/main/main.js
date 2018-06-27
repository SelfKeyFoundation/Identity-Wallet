'use strict';
const path = require('path');
const fs = require('fs');
const url = require('url');
const electron = require('electron');
const os = require('os');
const { Menu, Tray, autoUpdater } = require('electron');
const isOnline = require('is-online');
const config = buildConfig(electron);

const log = require('electron-log');

log.transports.file.level = true;
log.transports.console.level = true;

log.transports.console.level = 'info';

log.info('starting: ' + electron.app.getName());

const userDataDirectoryPath = electron.app.getPath('userData');
const walletsDirectoryPath = path.resolve(userDataDirectoryPath, 'wallets');
const documentsDirectoryPath = path.resolve(userDataDirectoryPath, 'documents');

const createMenuTemplate = require('./menu');

/**
 * auto updated
 */
const { appUpdater } = require('./autoupdater');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	log.info('missing: electron-squirrel-startup');
	process.exit(0);
}

const app = {
	dir: {
		root: __dirname + '/../',
		desktopApp: __dirname + '/../app'
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
	app.translations[i18n[i]] = require('./i18n/' + i18n[i] + '.js');
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
			electron.app.quit();
			return;
		}

		if (process.env.NODE_ENV !== 'development' && process.env.MODE !== 'test') {
			// Initate auto-updates
			appUpdater();
		}

		const initDb = require('./services/knex').init;

		await initDb();

		app.config.userDataPath = electron.app.getPath('userData');

		electron.app.helpers = require('./controllers/helpers')(app);

		const CMCService = require('./controllers/cmc-service')(app);
		electron.app.cmcService = new CMCService();

		const AirtableService = require('./controllers/airtable-service')(app);
		electron.app.airtableService = new AirtableService();

		const SqlLiteService = require('./controllers/sql-lite-service')(app);
		electron.app.sqlLiteService = new SqlLiteService();

		const LedgerService = require('./controllers/ledger-service')(app);
		electron.app.ledgerService = new LedgerService();

		const Web3Service = require('./controllers/web3-service')(app);
		electron.app.web3Service = new Web3Service();

		const RPCHandler = require('./controllers/rpc-handler')(app);
		electron.app.rpcHandler = new RPCHandler();
		electron.app.rpcHandler.startTokenPricesBroadcaster(electron.app.cmcService);

		const TxHistory = require('./controllers/tx-history-service').default(app);
		electron.app.txHistory = new TxHistory();

		createKeystoreFolder();

		// TODO
		// 1) load ETH & KEY icons & prices
		// 2) insert tokenPrices - set icon & price
		// 3) notify angular app when done

		if (electron.app.dock) {
			electron.app.dock.setIcon(__static + '/assets/icons/png/newlogo-256x256.png');
		}

		mainWindow = new electron.BrowserWindow({
			title: electron.app.getName(),
			width: 1170,
			height: 800,
			minWidth: 1170,
			minHeight: 800,
			webPreferences: {
				nodeIntegration: false,
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

		if (isDebugging()) {
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

		mainWindow.webContents.on('did-finish-load', () => {
			isOnline()
				.then(isOnline => {
					log.info('is-online', isOnline);
					if (!isOnline) {
						mainWindow.webContents.send('SHOW_IS_OFFLINE_WARNING');
						return;
					}

					log.info('did-finish-load');
					mainWindow.webContents.send('APP_START_LOADING');
					//start update cmc data
					electron.app.cmcService.startUpdateData();
					electron.app.airtableService.loadIdAttributeTypes();
					electron.app.airtableService.loadExchangeData();
					electron.app.txHistory.startSyncingJob();
					mainWindow.webContents.send('APP_SUCCESS_LOADING');
				})
				.catch(error => {
					log.error(error);
					mainWindow.webContents.send('APP_FAILED_LOADING');
				});
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
			if (electron.app.rpcHandler[actionName]) {
				electron.app.rpcHandler[actionName](event, actionId, actionName, args);
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

	const ChildProcess = require('child_process');

	const appFolder = path.resolve(process.execPath, '..');
	const rootAtomFolder = path.resolve(appFolder, '..');
	const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
	const exeName = 'Identity-Wallet-Installer.exe';

	const spawn = function(command, args) {
		let spawnedProcess, error;

		try {
			spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
		} catch (error) {}

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

/**
 *
 */
function isDevMode() {
	if (process.env.NODE_ENV === 'development') {
		return true;
	}
	return false;
}

function isDebugging() {
	if (process.env.DEV_TOOLS === 'yes') {
		return true;
	}
	return false;
}

function buildConfig(electron) {
	let config = require('./config');

	const envConfig = isDevMode() || isDebugging() ? config.default : config.production;
	config = Object.assign(config, envConfig);

	delete config.default;
	delete config.production;

	return config;
}
