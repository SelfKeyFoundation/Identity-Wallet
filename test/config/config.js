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
if (osEnv === 'travis') {
	appPath = pwd + '/dist/' + 'mac/' + appCacheName + '.app/Contents/MacOS/' + appCacheName;
}

if (osEnv === 'circle') {
	chmodCmd = 'chmod a+x ' + pwd + '/dist/' + appBuildName + '-' + appVersion + '-x86_64.AppImage';
	appPath = pwd + '/dist/' + appBuildName + '-' + appVersion + '-x86_64.AppImage';
}

if (osEnv === 'linux') {
	chmodCmd = 'chmod a+x ' + pwd + '/dist/' + appBuildName + '-' + appVersion + '-x86_64.AppImage';
	appPath = pwd + '/dist/' + appBuildName + '-' + appVersion + '-x86_64.AppImage';
}

if (osEnv === 'docker') {
	appPath = pwd + '/dist/' + appBuildName + '-' + appVersion + '-x86_64.AppImage';
}

if (osEnv === 'windows') {
	appPath = pwd + '\\dist\\' + appCacheName + ' Setup ' + appVersion + '.exe';
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
