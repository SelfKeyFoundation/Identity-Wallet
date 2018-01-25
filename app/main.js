'use strict';

const path = require('path');
const url = require('url');
const electron = require('electron');
const {Menu, Tray} = require('electron');
//const {autoUpdater} = require('electron-updater');

// windows installer
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

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    // app.quit() is the source of all our problems,
    // cf. https://github.com/itchio/itch/issues/202
    process.exit(0)
}

if (!handleSquirrelEvent()) {

	let devModeStarted = false;
	if(process.argv.length > 2) {
		if(process.argv[2] === 'dev') {
			devModeStarted = true;
		}
	}

	const parsedConfig = require('./config');
	let extraConfig = parsedConfig.production;

	if(devModeStarted) {
		extraConfig = parsedConfig.default;
	}
	const config = Object.assign(parsedConfig.common, extraConfig);

	const app = {
		dir: {
			root:  __dirname + '/../',
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

	const AsyncRequestHandler = require('./controllers/async-request-handler')(app);

	for(let i in i18n){
		app.translations[i18n[i]] = require('./i18n/' + i18n[i] + '.js');
	}

	function createWindow(app) {
		return function () {

			//electron.app.dock.setIcon('assets/icons/png/256X256.png');
			let tray = new Tray('assets/icons/png/256X256.png');
			tray.setToolTip('selfkey');


			app.win = new electron.BrowserWindow({
				width: 1160,
				height: 800,
				minWidth: 1160,
				minHeight: 800,
				webPreferences: {
					nodeIntegration: false,
					webSecurity: true,
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

			//app.win.maximize(); //todo move to configs

			app.win.on('closed', () => {
				app.win = null;
			});

			app.win.webContents.on('did-finish-load', () => {
				app.win.webContents.send('ON_READY');
			});

			/**
			 * Create the Application's main menu
			 */
			let template = [{
				label: "Edit",
				submenu: [
					{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
					{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
					{ type: "separator" },
					{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
					{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
					{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
					{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
				]}
			];
		
			Menu.setApplicationMenu(Menu.buildFromTemplate(template));

			electron.app.asyncRequestHandler = new AsyncRequestHandler();

			electron.ipcMain.on('ON_CONFIG_CHANGE', (event, userConfig) => {
				console.log('ON_CONFIG_CHANGE', userConfig);
				app.config.user = userConfig;
			});

			electron.ipcMain.on('ON_ASYNC_REQUEST', (event, actionId, actionName, args) => {
				console.log('ON_ASYNC_REQUEST', actionId, actionName);
				// TODO - check method exists
				electron.app.asyncRequestHandler[actionName](event, actionId, actionName, args);
			});
		};
	}

	electron.app.on('window-all-closed', () => {
		//if (process.platform !== 'darwin') {
		electron.app.quit();
		//}
	});

	electron.app.on('activate', () => {
		if (app.win === null) {
			createWindow(app);
		}
	});

	electron.app.on('ready', createWindow(app));
}
