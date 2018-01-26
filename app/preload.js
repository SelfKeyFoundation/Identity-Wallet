const electron = require('electron');
const package = require(__dirname + "/../package.json");
const defaultWindowOpen = window.open;

const allowedUrls = [
    'https://youtube.com',
    'https://etherscan.io',
    'https://selfkey.org',
    'http://help.selfkey.org',
    'https://blog.selfkey.org',
    'https://selfkey.org/wp-content/uploads/2017/11/selfkey-whitepaper-en.pdf',
    'https://t.me/selfkeyfoundation'
];

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

window.version = package.version;

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
    for(let i in allowedUrls){
        console.log(url, allowedUrls[i]);
        if(url.startsWith(allowedUrls[i])){
            return defaultWindowOpen(url, ...args);
        }
    }
    
    console.log(url , "RESTRICTED");
    return null;
}