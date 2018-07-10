/* eslint-env node */ /* global window */
// eslint-disable-next-line
const appPackage = require(__dirname + '/../../package.json');
const config = require('./config');
const defaultWindowOpen = window.open;
const async = require('async');

window.appName = appPackage.productName;
window.appVersion = appPackage.version;

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
