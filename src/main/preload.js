/* istanbul ignore file */
/* eslint-env node */ /* global window */
// eslint-disable-next-line
const common = require('../common/utils/common');
const appPackage = require(`${__dirname}'/../../package.json`);
const config = require('../common/config');
const defaultWindowOpen = window.open;
const async = require('async');
const electron = require('electron');

window.electron = electron;
window.appName = appPackage.productName;
window.appVersion = appPackage.version;
window.isTestMode = common.isTestMode();

process.once('loaded', function() {
	window.setImmediate = async.setImmediate;
});

window.open = function(url, ...args) {
	for (let i in config.common.allowedUrls) {
		if (url.startsWith(config.common.allowedUrls[i])) {
			return defaultWindowOpen(url, ...args);
		}
	}
	return null;
};
