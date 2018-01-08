'use strict';

import ActionLogItem from '../../classes/action-log-item.js';

function SkActionLogsBoxDirective($log, $window, ConfigFileService, CONFIG) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            title : "@",
            maxnotifications : "@",
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



            //this is how you add a notificaiton
            //store.actionLogs = [];
            // store.actionLogs.push({
            //         date : new Date(),
            //         type : 'notification',
            //         text : 'other something'
            // }); 

            //this is how you save the store
            //   ConfigFileService.saveStore().then((s) => {
                  
            //       console.log("response - " + s.asd);
            //   })
            
            
            

            const filterNotifications = function(){
                
                let orderedNotifications = JSON.parse(JSON.stringify(store.actionLogs));

                
                //change string date to date
                orderedNotifications = orderedNotifications.map(function(obj){
                    if(typeof obj.date == "string"){
                        obj.date = new Date(obj.date);
                    }
                    return obj;
                })
                //order by date asc
                orderedNotifications = orderedNotifications.sort(function(a,b){
                    
                    if(a.date && b.date){
                        return a.date.getTime() < b.date.getTime();
                    }
                    return false;
                })
                
                if(scope.maxnotifications){
                    //remove unnececary notifications that are more the maxnotifications
                    orderedNotifications = orderedNotifications.filter(function(el, index){
                        if(!el.date){
                            return false;
                        }
                        return (index < parseInt(scope.maxnotifications));
                    }) 
                }   

                //add icon title and color to the notifications of the specific type
                orderedNotifications = orderedNotifications.map(function(obj){
                    let conf = CONFIG.notificationTypes[obj.type];
                    if(!conf){
                        return obj;
                    }
                    obj.icon = conf.icon;
                    obj.title = conf.title;
                    obj.color = conf.color;
                    return obj;
                })
                
                
                scope.actionLogList = orderedNotifications;
            }



            filterNotifications();

            scope.$watch(function(){return store.actionLogs.length}, function() {
                filterNotifications();
            });

        },
        replace: true,
        templateUrl: 'common/directives/sk-action-logs-box.html'
    }
}

export default SkActionLogsBoxDirective;