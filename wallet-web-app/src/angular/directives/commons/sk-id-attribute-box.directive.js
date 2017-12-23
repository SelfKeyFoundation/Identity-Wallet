'use strict';

import IdAttributeItem from '../../classes/id-attribute-item.js';

// TODO - rename sk-id-attribute-box(data="", callbacks="")
function SkIdAttributeBoxDirective($log, $window, $mdDialog, ConfigFileService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: "="
        },
        link: (scope, element, attrs, tabsCtrl) => {
            scope.config = { historyRowCount: 2 };

            // item type
            // scope.data.type = 'document' | 'static_data'


            scope.checkItemValue = (item) => {
                return (item && item.value);
            }

            scope.openAddEditDialog = function (event, actionType, item) {
                $mdDialog.show({
                    controller: SkIdAttributeBoxDirectiveAddEditDialog,
                    templateUrl: 'common/directives/sk-id-attribute-box/sk-add-edit-id-attribute-item-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    locals: {
                        config: {
                            title: "Upload your driver's License",
                            type: "static_data", // document, static_data
                            key: 'ID Card'
                        },
                        item: angular.copy(item.items[item.defaultItemId])
                    }
                }).then((respItem) => {
                    item.items[item.defaultItemId] = respItem;
                    let store = ConfigFileService.getStore();

                    if(actionType === 'edit'){
                        if(item.type === 'document'){
                            let itemToSave = store.idAttributes[item.key].items[respItem._id];
                            
                            /*
                            if(!itemToSave){
                                itemToSave = new IdAttributeItem();
                            }
                            */

                            itemToSave.name = respItem.name;
                            itemToSave.value = respItem.value;
                            itemToSave.size = respItem.size;
                            itemToSave.contentType = respItem.contentType;
                        }
                    }
                    
                    $log.info('store to save:', store);
                    //ConfigFileService.save();
                });
            };

            scope.statuses = {
                1: new DocumentProcessStatus(1, 'Needs verification', 'warning-box'),
                2: new DocumentProcessStatus(2, 'Verified', 'success-box'),
                3: new DocumentProcessStatus(3, 'Rejected', 'danger-box')
            };

            scope.deleteAttribute = (id, clickedItem) => {
                console.log(id);
                let store = ConfigFileService.getStore();
                let item = scope.data.idAttributeItems[scope.data.title];
                console.log(item);
                if(id !== item.defaultItemId) {
                    delete item.items[id];
                    delete store.idAttributes[scope.data.title].items[id];
                } else {
                    item.items[id] = { _id: id };
                    store.idAttributes[scope.data.title].items[id] = { _id: id };
                }

                clickedItem.clicked = false;
                $log.info('store to save:', store);
                // TODO save
            };

            scope.getFileNames = function (files) {
                if (!files || !files.length) return '';
                return files.map(file => file.name).join(', ');
            };

            console.log('passed data is:', scope.data);
        },
        replace: true,
        templateUrl: 'common/directives/sk-id-attribute-box/sk-id-attribute-box.html'
    }
}

function DocumentProcessStatus(status, name, icon) {
    this.status = status;
    this.name = name;
    this.icon = icon;
}

function SkIdAttributeBoxDirectiveAddEditDialog($rootScope, $scope, $log, $mdDialog, ElectronService, config, item) {
    'ngInject';

    $log.info('SkIdAttributeBoxDirectiveAddEditDialog', config, item);

    $scope.config = config;
    $scope.item = item;

    $scope.selectFile = (event) => {
        let promise = ElectronService.openFileSelectDialog(event);
        promise.then((resp) => {
            $log.info(resp);
            if(resp && resp.path){
                $scope.item.value = resp.path;
                $scope.item.contentType = resp.mimeType;
                $scope.item.size = resp.size;
            }
        });
    }

    $scope.save = () => {
        if(item.value){
            $mdDialog.hide(item);
        }
    }

    $scope.cancel = () => {
        $mdDialog.cancel();
    }
}

export default SkIdAttributeBoxDirective;


/*


"subscribtions": [
        {
            "_id": "",
            "createDate": "12-18-2017",
            "type": "ico",
            "info": {
                "symbol": "key",
                "startDate": "12-30-2017"
            }
        }
    ],
    "alerts": [
        {
            "subscribtionId": "",
            "createDate": "",
            "type": "",
            "text": ""
        }
    ],


*/