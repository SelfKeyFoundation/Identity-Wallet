'use strict';

const IdAttributeItem = requireAppModule('angular/classes/id-attribute-item');
const IdAttribute = requireAppModule('angular/classes/id-attribute');

function SkIdAttributeDirective($rootScope, $log, $window, $mdDialog, $mdPanel, CommonService, ConfigFileService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: "=",
            callbacks: "="
        },
        link: (scope, element, attrs) => {

            let initialIdAttributes = [
                'national_id',
                'id_selfie',
                'name',
                'country_of_residency'
            ];

            scope.itAttributeType = ConfigFileService.getIdAttributeType(scope.data.type);
            scope.items = scope.data.items;
            scope.config = {
                features: {
                    history: false,
                    itemAdd: true,
                    multipleValues: true
                }
            }

            scope.extractValue = (value) => {
                if (scope.itAttributeType.type !== 'static_data') {
                    return value.value.name;
                }
                return value ? value.value : 'empty value';
            }

            scope.getItemsCount = () => {
                return Object.keys(scope.data.items).length;
            }

            scope.openValueDeletePanel = (event, item, value) => {
                let itemElement = event.target.parentElement.parentElement.parentElement;

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
                    controller: itemValueDeletePanel,
                    locals: {
                        item: item,
                        value: value
                    }
                }

                $mdPanel.open(config);
            }

            scope.openValueEditDialog = (event, item, value) => {
                let promise = null;

                if(scope.itAttributeType.type === 'static_data'){
                    promise = $rootScope.openAddEditStaticDataDialog(event, item, value, scope.itAttributeType);
                } else {
                    promise = $rootScope.openAddEditDocumentDialog(event, item, value, scope.itAttributeType);
                }

                promise.then((resp) => {
                    value.value = resp;
                    $scope.promise = ConfigFileService.save();
                    $scope.promise.then(() => {
                        CommonService.showToast('success', 'saved');
                    });
                });
            }

            scope.openValueAddDialog = (event, item) => {
                let promise = null;

                if(scope.itAttributeType.type === 'static_data'){
                    promise = $rootScope.openAddEditStaticDataDialog(event, item, null, scope.itAttributeType);
                } else {
                    promise = $rootScope.openAddEditDocumentDialog(event, item, null, scope.itAttributeType);
                }

                promise.then((resp) => {
                    let itm = new IdAttributeItem(item);
                    itm.addValue(resp);
                    item = itm;

                    scope.promise = ConfigFileService.save();
                    scope.promise.then(() => {
                        CommonService.showToast('success', 'saved');
                    });
                });
            }

            scope.addNewItem = (event) => {
                let item = new IdAttributeItem();
                scope.items[item._id] = item;

                scope.addNewItemPromise = ConfigFileService.save();
                scope.addNewItemPromise.then(() => {
                    CommonService.showToast('success', 'Added');
                });
            }

            scope.openItemDeletePanel = (event, item) => {
                let itemElement = event.target.parentElement.parentElement.parentElement;

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
                    templateUrl: 'common/directives/sk-id-attribute/attribute-delete-panel.html',
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    position: position,
                    controller: itemDeletePanel,
                    locals: {
                        item: item,
                        items: scope.items
                    }
                }

                $mdPanel.open(config);
            }

            scope.isItemValueDeleteAvailable = (item) => {
                if(initialIdAttributes.indexOf(scope.itAttributeType.key) !== -1){
                    if(scope.itAttributeType.key === 'name'){
                        return item.values.length >= 4;
                    }
                    return item.values.length >= 2;
                }
                return true;
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-id-attribute/main.html'
    }
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
        if ($scope.item.value && $scope.item.name) {
            $mdDialog.hide($scope.item);
        }
    }

    $scope.cancel = () => {
        $mdDialog.cancel();
    }
}

function itemValueDeletePanel($rootScope, $scope, $log, mdPanelRef, CommonService, ConfigFileService, item, value) {
    'ngInject';

    $scope.promise = null;

    $scope.delete = (event) => {
        for (let i in item.values) {
            if (item.values[i]._id === value._id) {
                item.values.splice(i, 1);
                break;
            }
        }

        $scope.promise = ConfigFileService.save();

        $scope.promise.then(() => {
            CommonService.showToast('success', 'deleted');
            mdPanelRef.close().then(() => {
                mdPanelRef.destroy();
            });
        });
    }

    $scope.cancel = (event) => {
        mdPanelRef.close().then(() => {
            mdPanelRef.destroy();
        });
    }
}

function itemDeletePanel($rootScope, $scope, $log, mdPanelRef, CommonService, ConfigFileService, items, item) {
    'ngInject';

    $scope.promise = null;

    $scope.delete = (event) => {
        delete items[item._id];

        $scope.promise = ConfigFileService.save();

        $scope.promise.then(() => {
            CommonService.showToast('success', 'deleted');
            mdPanelRef.close().then(() => {
                mdPanelRef.destroy();
            });
        });
    }

    $scope.cancel = (event) => {
        mdPanelRef.close().then(() => {
            mdPanelRef.destroy();
        });
    }
}

module.exports = SkIdAttributeDirective;
