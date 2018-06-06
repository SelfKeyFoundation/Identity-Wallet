const path = require('path')
const electron = require('electron')
const dbFilePath = path.join(electron.app.getPath('userData'), 'IdentityWalletStorage.sqlite')
const setupFilesPath = (process.env.NODE_ENV === 'development') ? __dirname : electron.app.getAppPath() + "/dist";

module.exports = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: dbFilePath
	},
	migrations: {
		directory: __dirname + '/migrations/'
	},
	seeds: {
		directory: __dirname + '/seeds/'
	}
}
