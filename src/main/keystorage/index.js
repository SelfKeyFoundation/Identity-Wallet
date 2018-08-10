/* istanbul ignore file */
import keythereum from 'keythereum';

export const keystorage = keythereum;

keystorage.importFromDirectory = keystorage.importFromFile;

keystorage.importFromFile = function(filepath, cb) {
	var fs = require('fs');

	if (typeof cb !== 'function') {
		if (!filepath) {
			throw new Error('could not find key file for address ' + filepath);
		}
		return JSON.parse(fs.readFileSync(filepath));
	}
	return cb(JSON.parse(fs.readFileSync(filepath)));
};

export default keystorage;
