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

const setImmediatePromise = () =>
	new Promise(resolve => {
		setImmediate(() => resolve());
	});

const mapKeysAsync = async (obj, fn) => {
	const newObj = {};
	for (const key in obj) {
		if (!obj.hasOwnProperty(key)) continue;
		newObj[fn(obj[key], key)] = obj[key];
		await setImmediatePromise();
	}
	return newObj;
};

const arrayChunks = (arr, size) =>
	Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
		arr.slice(i * size, i * size + size)
	);

module.exports = {
	isDevMode,
	isTestMode,
	isDebugMode,
	isElectronApp,
	getUserDataPath,
	getSetupFilePath,
	getWalletsDir,
	mapKeysAsync,
	arrayChunks,
	setImmediatePromise
};
