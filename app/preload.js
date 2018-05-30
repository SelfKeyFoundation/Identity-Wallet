const appPackage = require(__dirname + "/../package.json");
const config = require('./config');
const defaultWindowOpen = window.open;
window.path = require('path');
window.config = config;
window.async = require('async');;

window.zxcvbn = require('zxcvbn');
window.qrcode = require('qrcode-generator');

require('@uirouter/angularjs');
require('angular-material');
require('angular-messages');
require('angular-sanitize');
require('angular-local-storage');
require('angular-qrcode');
require('angular-zxcvbn');

window.__dirname = __dirname;

window.requireAppModule = function (moduleName, isNear) {
    moduleName = moduleName.replace('../', '');
    let midRoute = isNear ? '/' : '/../renderer/';
    let path = __dirname + midRoute + moduleName;
    return require(path);
}

window.requireNodeModule = function (moduleName) {
    return require(moduleName);
}


window.isDevMode = function () {
    if (process.argv.length > 2) {
        if (process.argv[2] === 'dev') {
            return true;
        }
    }
    return false;
}

window.appName = appPackage.productName;
window.appVersion = appPackage.version;

/**
 *
 */
window.ipcRenderer = require('electron').ipcRenderer;

window.BigNumber = require('bignumber.js');
window.ethUtil = require('ethereumjs-util');
window.crypto = require('crypto');
window.ethUtil.crypto = crypto;

window.Web3 = require('web3');
window.Tx = require('ethereumjs-tx');

process.once('loaded', function () {
    window.setImmediate = window.async.setImmediate;
});

window.open = function (url, ...args) {
    for(let i in config.common.allowedUrls){
        if(url.startsWith(config.common.allowedUrls[i])){
            return defaultWindowOpen(url, ...args);
        }
    }
    return null;
}

window.require = requireNodeModule;
window.module = module;
