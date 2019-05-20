/* istanbul ignore file file */
import keythereum from 'keythereum';
import path from 'path';
import fs from 'fs';
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

export const getPrivateKey = (keystoreFilePath, password) => {
	try {
		fs.accessSync(keystoreFilePath, fs.constants.R_OK);
	} catch (error) {
		keystoreFilePath = path.resolve(getWalletsDir(), keystoreFilePath);
	}
	let keystore = keystorage.importFromFile(keystoreFilePath);
	return keystorage.recover(password, keystore);
};

export default keystorage;
