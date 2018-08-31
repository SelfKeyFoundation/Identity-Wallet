/* istanbul ignore file file */
import keythereum from 'keythereum';
import path from 'path';
import { getWalletsDir } from 'common/utils/common';

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

export const checkPassword = (wallet, password) => {
	let keystoreFileFullPath = path.join(getWalletsDir(), wallet.keystoreFilePath);
	let keystore = keystorage.importFromFile(keystoreFileFullPath);
	try {
		return keystorage.recover(password, keystore);
	} catch (err) {
		return false;
	}
};

export default keystorage;
