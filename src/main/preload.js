/* eslint-env node */ /* global window */
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
const react = require('react');
const redux = require('redux');
const reactRedux = require('react-redux');
const electronRedux = require('electron-redux');
const react2angular = require('react2angular');
let selfkeyUi = null;

document.addEventListener('DOMContentLoaded', () => {
	selfkeyUi = require('selfkey-ui');
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

const electron = require('electron');

const requireNodeModule = function(moduleName) {
	switch (moduleName) {
		case 'electron':
			return electron;
		case 'react':
			return react;
		case 'redux':
			return redux;
		case 'react-redux':
			return reactRedux;
		case 'electron-redux':
			return electronRedux;
		case 'selfkey-ui':
			return selfkeyUi;
		case 'react2angular':
			return react2angular;
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

window.require = requireNodeModule;
window.module = module;
