const electron = require('electron');
const path = require('path');

const DEV_ENV = 'development';

const isDevMode = () => process.env.NODE_ENV === DEV_ENV;

const isTestMode = () => process.env.MODE === 'test';

const isDebugMode = () => process.env.DEV_TOOLS === 'yes';

const isElectronApp = () => !!electron.app;

const getUserDataPath = () => (isElectronApp() ? electron.app.getPath('userData') : '');

const getSetupFilePath = () => {
	if (isDevMode() || !isElectronApp()) {
		return path.join(__dirname, '..', '..');
	}
	return path.join(electron.app.getAppPath(), 'dist');
};

const getWalletsDir = () => {
	return path.resolve(getUserDataPath(), 'wallets');
};

module.exports = {
	isDevMode,
	isTestMode,
	isDebugMode,
	isElectronApp,
	getUserDataPath,
	getSetupFilePath,
	getWalletsDir
};
