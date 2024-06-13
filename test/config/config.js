const chalk = require('chalk');
const user = require('os').userInfo().username;
const pj = require('../../package.json');
const appCacheName = pj.productName;
const appBuildName = pj.name;
const appVersion = pj.version;
const pwd = process.cwd();
const osEnv = process.env.OSENV || 'osx';
const path = require('path');

// Default Settings (OSX)
let appPath = pwd + '/dist/' + 'mac/' + appCacheName + '.app/Contents/MacOS/' + appCacheName;
let testDir = path.join(pwd, 'test');
let chmodCmd = false;
let cacheCmd = 'bash ' + pwd + '/test/utils/quick.sh ' + user;
let fullCmd =
	'bash ' + pwd + '/test/utils/full/full.sh ' + user + ' ' + pwd.replace('/test/utils/full/', '');

// OSENV Settings
if (osEnv === 'circle-mac') {
	appPath = '/tmp/mac/dist/' + 'mac/' + appCacheName + '.app/Contents/MacOS/' + appCacheName;
}

if (osEnv === 'circle-linux') {
	chmodCmd =
		'chmod a+x ' +
		path.join('/tmp', 'linux', 'dist', 'linux-unpacked', 'selfkey-identity-wallet');
	appPath = path.join('/tmp', 'linux', 'dist', 'linux-unpacked', 'selfkey-identity-wallet');
}

if (osEnv === 'linux') {
	chmodCmd = 'chmod a+x ' + path.join(pwd, 'dist', 'linux-unpacked', 'selfkey-identity-wallet');
	appPath = path.join(pwd, 'dist', 'linux-unpacked', 'selfkey-identity-wallet');
}

if (osEnv === 'docker') {
	appPath = pwd + '/dist/' + appBuildName + '-' + appVersion + '-x86_64.AppImage';
}

if (osEnv === 'windows' || process.platform === 'win32' || process.platform === 'win64') {
	appPath = path.join(pwd, 'dist', 'win-unpacked', 'Selfkey Identity Wallet.exe');
}

function consoleNotes() {
	const note =
		'Working Dir: ' +
		pwd +
		'\n' +
		'App Build: ' +
		appPath +
		'\n' +
		'Test Dir: ' +
		testDir +
		'\n' +
		'Platform: ' +
		process.platform +
		'\n' +
		'OS Environment: ' +
		osEnv +
		'\n' +
		'OS Username: ' +
		user +
		'\n' +
		'Product Name: ' +
		appCacheName +
		'\n' +
		'Build Name: ' +
		appBuildName +
		'\n' +
		'Build Version: ' +
		pj.version +
		'\n' +
		'NodeJS Version: ' +
		process.version +
		'\n';

	console.log(chalk.blue('SelfKey ID Wallet Test Config'));
	console.log(chalk.blue('*****************************'));
	console.log(
		chalk.blue(`
    _______   _______   __       _______  ___ ___ _________  ____    ___
   /       | |   ____| |  |     |   ____||  |/  / |   _____| \\   \\  /  /
   |   (---- |  |__    |  |     |  |__   |     /  |  |__      \\   \\/  /
   \\   \\     |   __|   |  |     |   __|  |   <    |   __|      \\_   _/
.----)   |   |  |____  |  -----||  |     |     \\  |  |____      |  |
|_______/    |_______| |_______||__|     |__|\\__\\ |_______|     |__|
                                                                      `)
	);
	console.log(chalk.blue(note));
}

module.exports = {
	appPath,
	testDir,
	cacheCmd,
	fullCmd,
	consoleNotes,
	chmodCmd
};
