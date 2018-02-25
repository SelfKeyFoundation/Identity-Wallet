const electron = require('electron')
Application = require('spectron').Application
c = require('./utils/cache.js')
t = require('./utils/tools.js')
b = require('./utils/build.js')
delay = require('delay')
chalk = require('chalk')
exec = require('child_process').exec
pwd = process.cwd()
usr = process.argv[2] || 0
platform = process.argv[3] || 'local'
OSENV = process.env.OSENV || 'osx'
appCacheName = require('../package.json').productName
appBuildName = require('../package.json').config.forge.electronPackagerConfig.name
appVersion = require('../package.json').version
user = require('os').userInfo().username

var conf = []
conf = [
	{
		os: 'osx',
		platform: 'local',
		remove: [
			'/Users/' + user + '/Library/Application Support/Electron',
			'/Users/' + user + '/Library/Application Support/ID Wallet',
			'/Users/' + user + '/Library/Application Support/id-wallet',
			'/Users/' + user + '/Library/Application Support/' + appCacheName,
			'/Users/' + user + '/Library/Application Support/' + appBuildName
			//'rm -rf ' + pwd + '/' + appBuildName + '/out'
		]
	}
]

// Init
// ************
// Check Platform and Environment
// Clear Cache Directories
// Make Clean Build

// function init(config) {
// 	return new Promise((r,rj) => {
// 		// TODO: Check Platform / OS First
// 		for (var i = config.length - 1; i >= 0; i--) {
// 			var rmv = config[i].remove
// 			for (var j = rmv.length - 1; j >= 0; j--) {
// 				console.log(rmv[j])
// 				console.log(fs.existsSync(rmv[j]))
// 				if (fs.existsSync(rmv[j])) {
// 					rmstr = 'rm -rf ' + rmv[j]
// 					exec(rmstr, err => {
// 						if (err) rj(console.log(err))
// 						console.log(fs.existsSync(rmstr))
// 						r(console.log('delete done'))
// 					})
// 				} else {
// 					r(console.log('fake done'))
// 				}
// 			}
// 		}
// 	})
// }

function init() {
	return new Promise((r, rj) => {
		exec('bash ' + pwd + '/test/utils/quick.sh ' + user, err => {
			if (err) rj(err)
			r('done')
		})
	})
}
