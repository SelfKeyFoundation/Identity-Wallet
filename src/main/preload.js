/* istanbul ignore file */
/* eslint-env node */ /* global window */
// eslint-disable-next-line
const nodeMachineId = require('node-machine-id');
const common = require('../common/utils/common');
const appPackage = require(`${__dirname}'/../../package.json`);
const config = require('../common/config');
const defaultWindowOpen = window.open;
const electron = require('electron');
const PDFWindow = require('electron-pdf-window');
window.startTS = config.startTime;
window.electron = electron;
window.appName = appPackage.productName;
window.appVersion = appPackage.version;
window.isTestMode = common.isTestMode();
window.machineId = nodeMachineId.machineIdSync();

window.open = function(url, ...args) {
	for (let i in config.common.allowedUrls) {
		if (url.startsWith(config.common.allowedUrls[i])) {
			return defaultWindowOpen(url, ...args);
		}
	}
	return null;
};

// quit app
window.quit = event => {
	electron.remote.app.quit();
};

window.openDirectorySelectDialog = async event => {
	try {
		const dialogConfig = {
			title: 'Choose where to save documents',
			message: 'Choose where to save documents',
			properties: ['openDirectory']
		};

		const { filePaths, canceled } = await electron.remote.dialog.showOpenDialog(
			electron.remote.app.win,
			dialogConfig
		);
		if (canceled || !filePaths || !filePaths.length) {
			throw new Error('Directory not Selected');
		}
		return filePaths[0];
	} catch (e) {
		console.log(e);
		throw e;
	}
};

window.openFileSelectDialog = async event => {
	try {
		const dialogConfig = {
			title: 'Choose keystore file (UTC/JSON)',
			message: 'Choose keystore file (UTC/JSON)',
			properties: ['openFile']
		};
		const { filePaths, canceled } = await electron.remote.dialog.showOpenDialog(
			electron.remote.app.win,
			dialogConfig
		);

		if (canceled || !filePaths || !filePaths.length) {
			throw new Error('File not Selected');
		}

		return filePaths[0];
	} catch (e) {
		console.log(e);
		throw e;
	}
};

window.openPDF = href => {
	if (!href) return;
	const { BrowserWindow } = electron.remote;
	const win = new BrowserWindow({ width: 800, height: 600 });
	PDFWindow.addSupport(win);
	win.loadURL(href);
};
