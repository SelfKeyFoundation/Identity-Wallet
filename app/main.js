'use strict';

const path = require('path');
const url = require('url');
const electron = require('electron');
const os = require('os');
const { Menu, Tray, autoUpdater } = require('electron');

const config = buildConfig (electron);

const log = require('electron-log');
log.transports.file.appName = electron.app.getName();

/**
 * auto updated
 */
const platform = os.platform() + '_' + os.arch();
const version = electron.app.getVersion();


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-line global-require
if (require('electron-squirrel-startup')) { 
	// app.quit() is the source of all our problems,
	// cf. https://github.com/itchio/itch/issues/202
	process.exit(0)
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
	translations: {
	},
	win: {}
};

const i18n = [
	'en'
];

for (let i in i18n) {
	app.translations[i18n[i]] = require('./i18n/' + i18n[i] + '.js');
}

if (!handleSquirrelEvent()) {
	electron.app.on('window-all-closed', onWindowAllClosed());
	electron.app.on('activate', onActivate(app));
	electron.app.on('web-contents-created', onWebContentsCreated);
	electron.app.on('ready', onReady(app));
}

/**
 * 
 */
function onReady(app) {
	return function () {
		const AsyncRequestHandler = require('./controllers/async-request-handler')(app);
		electron.app.asyncRequestHandler = new AsyncRequestHandler();
		if(electron.app.doc) {
			electron.app.dock.setIcon(path.join(app.dir.root, 'assets/icons/png/256x256.png'));
		}
		
		//let tray = new Tray('assets/icons/png/256X256.png');
		//tray.setToolTip('selfkey');

		app.win = new electron.BrowserWindow({
			title: electron.app.getName(),
			width: 1170,
			height: 800,
			minWidth: 1170,
			minHeight: 800,
			webPreferences: {
				nodeIntegration: false,
				webSecurity: true,
				//experimentalFeatures: true,
				disableBlinkFeatures: 'Auxclick',
				devTools: app.config.app.debug,
				preload: path.join(app.dir.desktopApp, 'preload.js')
			},
			icon: path.join(app.dir.root, 'assets/icons/png/256x256.png')
		});

		let webAppPath = path.join(app.dir.root, '/app/src', 'index.html');

		app.win.loadURL(url.format({
			pathname: webAppPath,
			protocol: 'file:',
			slashes: true
		}));

		if (app.config.app.debug) {
			app.win.webContents.openDevTools();
		}

		app.win.on('closed', () => {
			app.win = null;
		});

		setAutoUpdaterListeners (app.win);

		if(!isDevMode()){
			autoUpdater.setFeedURL(config.updateEndpoint + '/update/' + platform + '/' + version);
			setTimeout(()=>{
				autoUpdater.checkForUpdates();
			}, 5000);
		}

		app.win.webContents.on('did-finish-load', () => {
			app.win.webContents.send('ON_READY', config);
		});

		/**
		 * Create the Application's main menu
		 */
		let template = [];

		if (process.platform === 'darwin') {
			template.unshift({
			  label: electron.app.getName(),
			  submenu: [
				{label: "About", role: 'about'},
				{label: "Quit", role: 'quit'}
			  ]
			});
		}

		template.push({
			label: "Edit",
			submenu: [
				{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
				{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
				{ type: "separator" },
				{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
				{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
				{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
				{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
			]
		});

		Menu.setApplicationMenu(Menu.buildFromTemplate(template));

		electron.ipcMain.on('ON_CONFIG_CHANGE', (event, userConfig) => {
			app.config.user = userConfig;
		});

		electron.ipcMain.on('ON_ASYNC_REQUEST', (event, actionId, actionName, args) => {
			if(electron.app.asyncRequestHandler[actionName]){
				electron.app.asyncRequestHandler[actionName](event, actionId, actionName, args);
			}
		});
	};
}

function onActivate (app) {
	return function () {
		if (app.win === null) {
			onReady(app);
		}
	}
}

function onWindowAllClosed () {
	return () => {
		return electron.app.quit();
	}
}

function onWebContentsCreated(event, contents){
	contents.on('will-attach-webview', (event, webPreferences, params) => {
		delete webPreferences.preload;
		delete webPreferences.preloadURL;

		// Disable node integration
		webPreferences.nodeIntegration = false;
		webPreferences.sandbox = true;

		let found = false;
		for(let i in config.common.allowedUrls){
			if(params.src.startsWith(config.common.allowedUrls[i])){
				found = true;
				break;
			}
		}

		if(!found){
			return event.preventDefault()
		}
	});
}

function setAutoUpdaterListeners (win) {
	autoUpdater.on("error", (error) => {
		log.warn('error: ' + error);
	});
	
	autoUpdater.on("checking-for-update", ()=>{
		log.warn('checking-for-update');
	});
	
	autoUpdater.on("update-available", ()=>{
		log.warn('update-available');
	});
	
	autoUpdater.on("update-not-available", ()=>{
		log.warn('update-not-available');
	});
	
	autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL)=>{
		log.warn('update-downloaded: ' + releaseName);
		win.webContents.send('UPDATE_READY', releaseName);
	});
}

/**
 * 
 */
function handleSquirrelEvent() {
	if (process.argv.length === 1) {
		return false;
	}

	const ChildProcess = require('child_process');
	const path = require('path');

	const appFolder = path.resolve(process.execPath, '..');
	const rootAtomFolder = path.resolve(appFolder, '..');
	const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
	const exeName = 'Identity-Wallet-Installer.exe';

	const spawn = function (command, args) {
		let spawnedProcess, error;

		try {
			spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
		} catch (error) { }

		return spawnedProcess;
	};

	const spawnUpdate = function (args) {
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
}

/**
 * 
 */
function isDevMode(){
	if (process.argv.length > 2) {
		if (process.argv[2] === 'dev') {
			return true;
		}
	}
	return false;
}

function buildConfig (electron) {
	let config = require('./config');

	const envConfig = isDevMode() ? config.default : config.production;
	config = Object.assign(config, envConfig);

	delete config.default;
	delete config.production;

	return config;
}