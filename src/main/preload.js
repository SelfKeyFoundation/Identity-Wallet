/* eslint-env node */ /* global window */
const path = require('path');
// eslint-disable-next-line
const appPackage = require(__dirname + '/../../package.json');
const config = require('./config');
const defaultWindowOpen = window.open;
window.path = require('path');
window.config = config;
window.async = require('async');

window.zxcvbn = require('zxcvbn');
window.qrcode = require('qrcode-generator');

require('@uirouter/angularjs');
require('angular-material');
require('angular-messages');
require('angular-sanitize');
require('angular-local-storage');
require('angular-qrcode');
require('angular-zxcvbn');
window.react = require('react');
window.redux = require('redux');
window.reactRedux = require('react-redux');
window.electronRedux = require('electron-redux');
window.react2angular = require('react2angular');

document.addEventListener('DOMContentLoaded', () => {
	window.selfkeyUi = require('selfkey-ui');
});

window.__dirname = __dirname;

window.isDevMode = function() {
	if (process.env.NODE_ENV === 'development') {
		return true;
	}
	return false;
};

window.isTestMode = function() {
	if (process.env.MODE === 'test') {
		return true;
	}
	return false;
};

window.electron = require('electron');

window.requireAppModule = function(moduleName, isNear) {
	moduleName = moduleName.replace('../', '');
	let midRoute = isNear ? '/' : '/../renderer/';
	let modulePath = path.join(__dirname, midRoute, moduleName);
	return require(`${modulePath}`);
};

window.requireNodeModule = function(moduleName) {
	switch (moduleName) {
		case 'electron':
			return window.electron;
		case 'react':
			return window.react;
		case 'redux':
			return window.redux;
		case 'react-redux':
			return window.reactRedux;
		case 'electron-redux':
			return window.electronRedux;
		case 'selfkey-ui':
			return window.selfkeyUi;
		case 'react2angular':
			return window.react2angular;
		default:
			return require(`${moduleName}`);
	}
};

window.appName = appPackage.productName;
window.appVersion = appPackage.version;

/**
 *
 */
window.ipcRenderer = require('electron').ipcRenderer;

window.BigNumber = require('bignumber.js');
window.ethUtil = require('ethereumjs-util');
window.crypto = require('crypto');
window.ethUtil.crypto = window.crypto;

window.Web3 = require('web3');
window.Tx = require('ethereumjs-tx');

process.once('loaded', function() {
	window.setImmediate = window.async.setImmediate;
});

window.open = function(url, ...args) {
	for (let i in config.common.allowedUrls) {
		if (url.startsWith(config.common.allowedUrls[i])) {
			return defaultWindowOpen(url, ...args);
		}
	}
	return null;
};

window.require = window.requireNodeModule;
window.module = module;
