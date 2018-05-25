const chalk = require('chalk')
const user = require('os').userInfo().username
const pj = require('../../package.json')
const appCacheName = pj.productName
const appBuildName = pj.config.forge.electronPackagerConfig.name
const appVersion = pj.version
const pwd = process.cwd()
const osEnv = process.env.OSENV || 'osx'

// Default Settings (OSX)
let	appPath = pwd + '/out/' + appBuildName + '-darwin-x64/' + appBuildName + '.app/Contents/MacOS/' + appBuildName
let	testDir = pwd + '/test/e2e/basic_id/'
let	cacheCmd = 'bash ' + pwd + '/test/utils/quick.sh ' + user
let	fullCmd = 'bash ' + pwd + '/test/utils/full/full.sh ' + user + ' ' + pwd.replace('/test/utils/full/', '')

// OSENV Settings
if (osEnv === 'travis') {
	appPath = pwd + '/out/' + appBuildName + '-darwin-x64/' + appBuildName + '.app/Contents/MacOS/' + appBuildName
	testDir = pwd + '/test/e2e/basic_id/'
}

if (osEnv === 'circle') {
    appPath = pwd + '/out/' + appBuildName + '-linux-x64/' + appBuildName
    testDir = pwd + '/test/e2e/basic_id/'
}

if (osEnv === 'linux') {
    appPath = pwd + '/out/' + appBuildName + '-linux-x64/' + appBuildName
    testDir = pwd + '/test/e2e/basic_id/'
}

if (osEnv === 'docker') {
    appPath = pwd + '/out/' + appBuildName + '-linux-x64/' + appBuildName
    testDir = pwd + '/test/e2e/basic_id/'
}

if (osEnv === 'windows') {
    appPath = pwd + '\\out\\' + appBuildName + '-win32-ia32\\' + appBuildName + '.exe'
    testDir = pwd + '\\test\\e2e\\basic_id'
}

function consoleNotes() {
	const note = 
		'Working Dir: ' + pwd + '\n'  +
		'App Build: ' + appPath + '\n'  +
		'Test Dir: ' + testDir + '\n' +
		'Platform: ' + process.platform + '\n' +
		'OS Environment: ' + osEnv + '\n' +
		'OS Username: ' + user + '\n' +
		'Product Name: ' + appCacheName + '\n' +
		'Build Name: ' + appBuildName + '\n' +
		'Build Version: ' + pj.version + '\n' +
		'NodeJS Version: ' + process.version + '\n'

	console.log(chalk.blue('SelfKey ID Wallet Test Config'))
	console.log(chalk.blue('*****************************'))
	console.log(chalk.blue(`
    _______   _______   __       _______  ___ ___ _________  ____    ___
   /       | |   ____| |  |     |   ____||  |/  / |   _____| \\   \\  /  / 
   |   (---- |  |__    |  |     |  |__   |     /  |  |__      \\   \\/  /  
   \\   \\     |   __|   |  |     |   __|  |   <    |   __|      \\_   _/   
.----)   |   |  |____  |  -----||  |     |     \\  |  |____      |  |     
|_______/    |_______| |_______||__|     |__|\\__\\ |_______|     |__|     
                                                                      `))
	console.log(chalk.blue(note))
}

module.exports = {
	appPath,
	testDir,
	cacheCmd,
	fullCmd,
	consoleNotes
}
