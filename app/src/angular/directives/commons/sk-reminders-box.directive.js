import { setInterval } from "timers";

'use strict';

function SkRemindersBoxDirective($log, $window, ConfigFileService, CONFIG) {
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
           

            const filterReminders = function(){
                
                let orderedReminders = JSON.parse(JSON.stringify(store.reminders));
                
                
                //change string reminderDate to date
                orderedReminders = orderedReminders.map(function(obj){
                    if(typeof obj.reminderDate == "string"){
                        obj.reminderDate = new Date(obj.reminderDate);
                    }
                    return obj;
                })
                //order by reminderDate asc
                orderedReminders = orderedReminders.sort(function(a,b){
                    
                    if(a.reminderDate && b.reminderDate){
                        return a.reminderDate.getTime() < b.reminderDate.getTime();
                    }
                    return false;
                })
                
                //remove unnececary reminders that are not in the threshhold
                orderedReminders = orderedReminders.filter(function(el, index){
                    let now = new Date();
                    let threshhold = new Date(now.getTime() + store.settings.reminder.notifyBeforeTimeLeft);
                    if(el.reminderDate < now || el.reminderDate > threshhold){
                    
                        return false;
                    }
                    return true;
                }) 

                
                //add icon title and color to the reminders of the specific type
                orderedReminders = orderedReminders.map(function(obj){
                    let conf = CONFIG.reminderTypes[obj.type];
                    if(!conf){
                        return obj;
                    }
                    obj.icon = conf.icon;
                    obj.title = conf.title;
                    obj.color = conf.color;
                    return obj;
                })
                
                
                scope.reminderList = orderedReminders;
            }



            filterReminders();

            setInterval( function() {
                filterReminders();
            }, 10000);

        },
        replace: true,
        templateUrl: 'common/directives/sk-reminders-box.html'
    }
}

export default SkRemindersBoxDirective;