const path = require('path')
const electron = require('electron')
const dbFilePath = path.join(electron.app.getPath('userData'), 'IdentityWalletStorage.sqlite')
const setupFilesPath = (process.env.NODE_ENV === 'development')? __dirname : electron.app.getAppPath() + "/dist";

module.exports = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: dbFilePath
	},
	migrations: {
		directory: setupFilesPath + '/migrations/'
	},
	seeds: {
		directory: setupFilesPath + '/seeds/'
	}
}
