'use strict';


const RPC_METHOD = "ON_RPC";
const listeners = {};

function RPCService($rootScope, $window, $q, $timeout, $log, $http, CommonService) {
    'ngInject';

    $log.info('RPCService Initialized', ipcRenderer);

    /**
     *
     */
    class RPCService {

        constructor() {
            this.ipcRenderer = window.ipcRenderer;

            this.ipcRenderer.on(RPC_METHOD, (event, actionId, actionName, error, data) => {
                $log.info(actionName, error, data);

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

            this.ipcRenderer.on('SQL_DB_READY', (event) => {
                $rootScope.$broadcast('SQL_DB_READY');
            });

        }

        makeCall (actionName, data) {
            let defer = $q.defer();
            let id = CommonService.generateId();

            listeners[id] = {
                defer: $q.defer()
            }

            this.ipcRenderer.send("ON_RPC", id, actionName, data);

            return listeners[id].defer.promise;
        }

        makeCustomCall (actionName, data) {
            this.ipcRenderer.send(actionName, data);
        }

    };

    return new RPCService();
}

module.exports = RPCService;
