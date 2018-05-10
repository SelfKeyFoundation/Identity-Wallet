const path = require('path')
const user = require('os').userInfo().username
const OSENV = process.env.OSENV || 'osx'

let userDataPath

if (OSENV === 'windows') {
	userDataPath = '%APPDATA%\\Electron\\'
} else if (OSENV === 'linux') {
	userDataPath = '~/.config/Electron/'
} else {
	userDataPath = '/Users/' + user + '/Library/Application Support/Electron/'
}

const dbFilePath = path.join(userDataPath, 'IdentityWalletStorage.sqlite')

module.exports = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: dbFilePath
	},
	seeds: {
		directory: './seeds'
	}
}
