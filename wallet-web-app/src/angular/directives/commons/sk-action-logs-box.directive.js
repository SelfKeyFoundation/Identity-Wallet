'use strict';

import ActionLogItem from '../../classes/action-log-item.js';

function SkActionLogsBoxDirective($log, $window, ConfigFileService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            callbacks: "="
        },
        link: (scope, element) => {
            /**
             * types: notification, ...
             * actions: delete, ...
             */
            scope.configsByType = {
                notification: {
                    actions: ['delete'],
                    decorations: {
                        icon: '',
                        color: '',
                    }
                }
            }

            let store = ConfigFileService.getStore();

            $scope.actionLogList = [];

            let a = {
                "_id": "",
                "createAt": "2017-12-26T12:42:58.292Z",
                "subscribtionId": "0",
                "text": "Success! Created Basic SelfKey Identity",
                "type": "notification"
            }

            function init () {
                let actionLogs = store.actionLogs;

                for(let i in actionLogs){
                    let item = actionLogs[i];
                    let actionLogItem = new ActionLogItem(item._id, item.type, item.text, item.subscribtionId);
                    $scope.actionLogList.push(actionLogItem);
                }
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-action-logs-box.html'
    }
}

export default SkActionLogsBoxDirective;