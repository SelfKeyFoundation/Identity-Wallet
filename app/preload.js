window.requireAppModule = function (moduleName, isNear) {
    moduleName = moduleName.replace('../', '');
    let midRoute = isNear ? '/' : '/src/';
    let path = __dirname + midRoute + moduleName;
    return require(path);
}

window.isDevMode = function () {
    if (process.argv.length > 2) {
        if (process.argv[2] === 'dev') {
            return true;
        }
    }
    return false;
}

/**
 * External Modules
 */
require('@uirouter/angularjs');
require('angular-material');
require('angular-local-storage');

/**
 * 
 */
window.ipcRenderer = require('electron').ipcRenderer;
window.qrcode = require('angular-qrcode').qrcode;
window.BigNumber = require('bignumber.js');
window.ethUtil = require('ethereumjs-util');
window.crypto = require('crypto');
window.ethUtil.crypto = crypto;

window.async = require('async');
console.log(async);

window.Web3 = require('web3');
window.Tx = require('ethereumjs-tx');



/**
 * 
 */
require('./src/angular/app.templates');
  
/**
 * main module: 'kyc-wallet'
 */

window.app = angular.module('kyc-wallet', [
    'ngMaterial',
    'ui.router',
    'templates',
    'LocalStorageModule',
    'monospaced.qrcode'
]);
