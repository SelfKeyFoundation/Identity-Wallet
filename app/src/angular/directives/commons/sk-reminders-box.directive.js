'use strict';

function SkRemindersBoxDirective($log, $window) {
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
                    if(typeof obj.alertDate == "string"){
                        obj.alertDate = new Date(obj.alertDate);
                    }
                    return obj;
                })
                //order by date asc
                orderedNotifications = orderedNotifications.sort(function(a,b){
                    
                    if(a.alertDate && b.alertDate){
                        return a.date.getTime() < b.date.getTime();
                    }
                    return false;
                })
                
                    //remove unnececary notifications that are more the maxnotifications
                    orderedNotifications = orderedNotifications.filter(function(el, index){
                        let now = new Date();
                        let threshhold = new Date(now + )
                        if(el.alertDate <){
                            return false;
                        }
                    }) 
                
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
        templateUrl: 'common/directives/sk-reminders-box.html'
    }
}

export default SkRemindersBoxDirective;