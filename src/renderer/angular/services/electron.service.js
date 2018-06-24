'use strict';

const Wallet = require('../classes/wallet');

function ElectronService($rootScope, $window, $q, $timeout, $log, CONFIG, RPCService) {
	'ngInject';

	$log.debug('ElectronService Initialized');

	/**
	 *
	 */
	let ElectronService = function() {
		Wallet.ElectronService = this;

		this.openBrowserWindow = function(url) {
			return RPCService.makeCall('openBrowserWindow', { url: url });
		};

		this.initDataStore = function() {
			return RPCService.makeCall('initDataStore');
		};

		this.readDataStore = function() {
			return RPCService.makeCall('readDataStore');
		};

		this.saveDataStore = function(data) {
			return RPCService.makeCall('saveDataStore', { data: data });
		};

		this.importKYCIdentity = function(file) {
			return RPCService.makeCall('importKYCIdentity', { file: file });
		};

		/**
		 * TODO rename
		 */
		this.sendConfigChange = function(config) {
			RPCService.makeCustomCall('ON_CONFIG_CHANGE', config);
		};

		/**
		 *
		 */
		this.moveFile = function(src, dest) {
			return RPCService.makeCall('moveFile', { src: src, dest: dest, copy: true });
		};

		this.checkFileStat = function(filePath) {
			return RPCService.makeCall('checkFileStat', { src: filePath });
		};

		this.openDirectorySelectDialog = function() {
			return RPCService.makeCall('openDirectorySelectDialog', null);
		};

		this.openFileSelectDialog = function(params) {
			return RPCService.makeCall('openFileSelectDialog', params);
		};

		this.signPdf = function(input, output, certificate, password) {
			return RPCService.makeCall('signPdf', {
				input: input,
				output: output,
				certificate: certificate,
				password: password
			});
		};

		this.generateEthereumWallet = function(password, keyStoreSrc) {
			return RPCService.makeCall('generateEthereumWallet', {
				password: password,
				keyStoreSrc: keyStoreSrc
			});
		};

		this.importEthereumWallet = function(address, password, keyStoreSrc) {
			return RPCService.makeCall('importEthereumWallet', {
				address: address,
				password: password,
				keyStoreSrc: keyStoreSrc
			});
		};

		this.importEtherKeystoreFile = function(filePath) {
			return RPCService.makeCall('importEtherKeystoreFile', {
				filePath: filePath
			});
		};

		this.showNotification = function(title, text, options) {
			return RPCService.makeCall('showNotification', {
				title: title,
				text: text,
				options: options
			});
		};

		this.analytics = function(event, data) {
			return RPCService.makeCall('analytics', {
				event: event,
				data: data
			});
		};

		this.unlockEtherKeystoreObject = function(keystoreObject, password) {
			return RPCService.makeCall('unlockEtherKeystoreObject', {
				keystoreObject: keystoreObject,
				password: password
			});
		};

		this.importEtherPrivateKey = function(privateKey) {
			return RPCService.makeCall('importEtherPrivateKey', {
				privateKey: privateKey
			});
		};

		this.closeApp = function() {
			return RPCService.makeCall('closeApp', {});
		};

		this.installUpdate = function() {
			return RPCService.makeCall('installUpdate', {});
		};
	};

	return new ElectronService();
}
ElectronService.$inject = [
	'$rootScope',
	'$window',
	'$q',
	'$timeout',
	'$log',
	'CONFIG',
	'RPCService'
];
module.exports = ElectronService;
