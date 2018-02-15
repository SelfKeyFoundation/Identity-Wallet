'use strict';

const IdAttributeItem = requireAppModule('angular/classes/id-attribute-item');
const IdAttribute = requireAppModule('angular/classes/id-attribute');

function SkIdAttributeDirective($rootScope, $log, $window, $mdDialog, $mdPanel, ConfigFileService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: "=",
            callbacks: "="
        },
        link: (scope, element, attrs, tabsCtrl) => {

            console.log(">>>>>>", scope.data);

            scope.itAttributeType = ConfigFileService.getIdAttributeType(scope.data.type);
            scope.items = scope.data.items;
            scope.config = {
                features: {
                    history: false,
                    itemAdd: true,
                    multipleValues: true
                }
            }

            console.log("?????", scope.itAttributeType)

            scope.extractValue = (value) => {
                if (scope.itAttributeType.type !== 'static_data') {
                    return value.name;
                }
                return value ? value : 'empty value';
            }

            scope.getItemsCount = () => {
                return Object.keys(scope.data.items).length;
            }

            scope.openValueDeletePanel = (event, value) => {
                let itemElement = event.target.parentElement.parentElement.parentElement;
                console.log(itemElement, $mdPanel.yPosition);


                let position = $mdPanel
                    .newPanelPosition()
                    .relativeTo(angular.element(itemElement))
                    .addPanelPosition(
                        $mdPanel.xPosition.ALIGN_START,
                        $mdPanel.yPosition.ABOVE
                    );

                let config = {
                    attachTo: angular.element(document.body),
                    targetEvent: event,
                    templateUrl: 'common/directives/sk-id-attribute/value-delete-panel.html',
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    position: position,
                    controller: itemValueDeletePanel
                }

                $mdPanel.open(config).then((panelRef) => {

                });
            }













            scope.checkItemValue = (item) => {
                return (item && (item.value || item.path));
            }

            scope.openAddEditDialog = function (event, actionType, item) {
                let store = ConfigFileService.getStore();
                $mdDialog.show({
                    controller: SkIdAttributeBoxDirectiveAddEditDialog,
                    templateUrl: 'common/directives/sk-id-attribute-box/sk-add-edit-id-attribute-item-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    locals: {
                        config: {
                            title: "Upload your " + $rootScope.DICTIONARY["ID_ATTR_" + item.idAttributeType.key.toUpperCase()],       // todo
                            type: item.idAttributeType.type,                                                                          // document, static_data
                            key: item.idAttributeType.key
                        },
                        item: angular.copy(item)
                    }
                }).then((respItem) => {
                    item.name = item.name;
                    item.value = item.value;
                    item.path = item.path;
                    item.size = item.size;
                    item.contentType = item.contentType;

                    if (!store.idAttributes[item.idAttributeType.key]) {
                        store.idAttributes[item.idAttributeType.key] = scope.data;
                    }

                    let itemToSave = store.idAttributes[item.idAttributeType.key].items[respItem._id];

                    itemToSave.name = respItem.name;
                    itemToSave.value = respItem.value;
                    if (scope.data.type === 'document') {
                        itemToSave.size = respItem.size;
                        itemToSave.contentType = respItem.contentType;
                    }

                    $log.info('store to save:', store);
                    //$rootScope.$broadcast('id-attributes-changed', scope.data);


                    ConfigFileService.save().then((resp) => {
                        // show message
                        if (scope.config && scope.config.callback && scope.config.callback.itemChanged) {
                            scope.config.callback.itemChanged(scope.data);
                        }

                        $rootScope.$broadcast('id-attributes-changed', scope.data);
                    });
                });
            };

            scope.statuses = {
                1: new DocumentProcessStatus(1, 'Needs verification', 'warning-box'),
                2: new DocumentProcessStatus(2, 'Verified', 'success-box'),
                3: new DocumentProcessStatus(3, 'Rejected', 'danger-box')
            };

            scope.deleteAttribute = (id, clickedItem) => {
                let store = ConfigFileService.getStore();
                console.log(id, clickedItem);

                clickedItem.name = null;
                clickedItem.value = null;

                store.idAttributes[scope.data.key].items[id].name = null;
                store.idAttributes[scope.data.key].items[id].value = null;

                if (clickedItem.idAttributeType === 'document') {
                    clickedItem.contentType = null;
                    clickedItem.size = null;

                    store.idAttributes[scope.data.key].items[id].contentType = null;
                    store.idAttributes[scope.data.key].items[id].size = null;
                }

                delete clickedItem.clicked;

                $log.info('store to save:', store);

                //$rootScope.$broadcast('id-attributes-changed', scope.data);

                ConfigFileService.save().then((resp) => {
                    // show message
                    if (scope.config && scope.config.callback && scope.config.callback.itemChanged) {
                        scope.config.callback.itemChanged(scope.data);
                    }
                    $rootScope.$broadcast('id-attributes-changed', scope.data);
                });
            };

            scope.getFileNames = function (files) {
                if (!files || !files.length) return '';
                return files.map(file => file.name).join(', ');
            };
        },
        replace: true,
        templateUrl: 'common/directives/sk-id-attribute/main.html'
    }
}

function DocumentProcessStatus(status, name, icon) {
    this.status = status;
    this.name = name;
    this.icon = icon;
}

function SkIdAttributeBoxDirectiveAddEditDialog($rootScope, $scope, $log, $mdDialog, ElectronService, config, item, countries) {
    'ngInject';

    $log.info('SkIdAttributeBoxDirectiveAddEditDialog', config, item);
    $scope.countries = countries.countryList;

    if (item.idAttributeType.key === 'national_id' && item.addition.selfie) {
        item.name = $rootScope.DICTIONARY["ID_ATTR_NATIONAL_ID_WITH_SELFIE"];
    } else {
        item.name = $rootScope.DICTIONARY[item.idAttributeType.key];
    }


    $scope.config = config;
    $scope.item = item;

    $scope.selectFile = (event) => {
        let promise = ElectronService.openFileSelectDialog(event);
        promise.then((resp) => {
            if (resp && resp.path) {
                $scope.item.value = resp.path;
                $scope.item.contentType = resp.mimeType;
                $scope.item.size = resp.size;
            }
        });
    }

    $scope.save = () => {
        console.log($scope.item, item, "<<<<<<");
        if ($scope.item.value && $scope.item.name) {
            $mdDialog.hide($scope.item);
        }
    }

    $scope.cancel = () => {
        $mdDialog.cancel();
    }
}

function itemValueDeletePanel ($rootScope, $scope, $log, mdPanelRef) {
    $log.info(">>>>>>", mdPanelRef);

    $scope.cancel = (event) => {
        mdPanelRef.close().then(()=>{
            mdPanelRef.destroy();
        });
    }
}

module.exports = SkIdAttributeDirective;
