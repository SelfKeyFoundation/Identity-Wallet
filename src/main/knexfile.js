const path = require('path')
const electron = require('electron')
const dbFilePath = path.join(electron.app.getPath('userData'), 'IdentityWalletStorage.sqlite')

module.exports = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: dbFilePath
	},
	migrations: {
		directory: __static + '/migrations'
	},
	seeds: {
		directory: __static + '/seeds'
	}
}
