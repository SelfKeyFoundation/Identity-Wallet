'use strict';
const { Logger } = require('common/logger');
const log = new Logger('RPCService');
const RPC_METHOD = 'ON_RPC';
const listeners = {};
const ipcRenderer = require('electron').ipcRenderer;

function RPCService($rootScope, $window, $q, $timeout, $http, CommonService) {
	'ngInject';

	log.debug('RPCService Initialized, %s', ipcRenderer);

	/**
	 *
	 */
	class RPCService {
		constructor() {
			this.ipcRenderer = ipcRenderer;

			this.ipcRenderer.on(RPC_METHOD, (event, actionId, actionName, error, data) => {
				log.debug('%s %s %j', actionName, error, data);

				if (error) {
					listeners[actionId].defer.reject(error);
				} else {
					listeners[actionId].defer.resolve(data);
				}

				$timeout(() => {
					delete listeners[actionId];
				}, 1000);
			});

			this.ipcRenderer.on('UPDATE_READY', (event, releaseName) => {
				$rootScope.openUpdateDialog(null, releaseName);
			});

			this.ipcRenderer.on('APP_START_LOADING', event => {
				$rootScope.$broadcast('APP_START_LOADING');
			});

			this.ipcRenderer.on('APP_SUCCESS_LOADING', event => {
				$rootScope.$broadcast('APP_SUCCESS_LOADING');
			});

			this.ipcRenderer.on('APP_FAILED_LOADING', event => {
				$rootScope.$broadcast('APP_FAILED_LOADING');
			});
		}

		makeCall(actionName, data) {
			let id = CommonService.generateId();

			listeners[id] = {
				defer: $q.defer()
			};

			this.ipcRenderer.send('ON_RPC', id, actionName, data);

			return listeners[id].defer.promise;
		}

		makeCustomCall(actionName, data) {
			this.ipcRenderer.send(actionName, data);
		}

		on(method, cb) {
			this.ipcRenderer.on(method, cb);
		}
	}

	return new RPCService();
}
RPCService.$inject = ['$rootScope', '$window', '$q', '$timeout', '$http', 'CommonService'];
module.exports = RPCService;
