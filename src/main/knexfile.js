const path = require('path');
const electron = require('electron');

// Checking for electron.app so that knex CLI generators still work with this knexfile
const dbFilePath = electron.app
	? path.join(electron.app.getPath('userData'), 'IdentityWalletStorage.sqlite')
	: 'IdentityWalletStorage.sqlite';
const setupFilesPath =
	process.env.NODE_ENV === 'development' || !electron.app
		? __dirname
		: electron.app.getAppPath() + '/dist';

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
};
