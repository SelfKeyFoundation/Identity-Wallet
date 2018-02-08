const package = require(__dirname + "/../package.json");
const config = require('./config');
const defaultWindowOpen = window.open;

window.requireAppModule = function (moduleName, isNear) {
    moduleName = moduleName.replace('../', '');
    let midRoute = isNear ? '/' : '/src/';
    let path = __dirname + midRoute + moduleName;
    return require(path);
}

window.requireNodeModule = function (moduleName) {
    if (package.dependencies[moduleName]) {
        return require(moduleName);
    }
    return null;
}

window.isDevMode = function () {
    if (process.argv.length > 2) {
        if (process.argv[2] === 'dev') {
            return true;
        }
    }
    return false;
}

window.appName = package.productName;
window.appVersion = package.version;

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
    window.async = require('async');
    window.setImmediate = require('async').setImmediate;
});

window.open = function (url, ...args) {
    for(let i in config.common.allowedUrls){
        if(url.startsWith(config.common.allowedUrls[i])){
            return defaultWindowOpen(url, ...args);
        }
    }
    return null;
}