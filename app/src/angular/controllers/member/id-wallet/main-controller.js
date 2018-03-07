const IdAttribute = requireAppModule('angular/classes/id-attribute');

function MemberIdWalletMainController($rootScope, $scope, $log, $mdDialog, $mdPanel, SqlLiteService, CommonService, RPCService) {
    'ngInject'

    $log.info('MemberIdWalletMainController');

    (function () {
        $mdDialog.show({
            controller: 'IdWalletInfoController',
            templateUrl: 'common/dialogs/id-wallet-info.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: true,
            escapeToClose: false,
            locals: {}
        });
    })();


    let ID_ATTRIBUTE_TYPES = {};
    let excludeKeys = [];

    $scope.initialIdAttributes = ['first_name', 'last_name', 'middle_name', 'country_of_residency', 'id_selfie', 'national_id', 'email'];

    $scope.attributesList = [];
    $scope.idDocumentsList = [];

    SqlLiteService.loadIdAttributeTypes();

    prepareData();

    /**
     *
     */
    $scope.addIdAttribute = (event, type) => {
        $mdDialog.show({
            controller: "AddIdAttributeDialogController",
            templateUrl: "common/dialogs/id-attributes/add-id-attribute.html",
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                excludeKeys: excludeKeys,
                type
            }
        }).then((selectedIdAttributeType) => {
            let idAttribute = {
                walletId: $rootScope.wallet.id,
                idAttributeType: selectedIdAttributeType.key
            }

            SqlLiteService.addIdAttribute(idAttribute).then((response) => {
                prepareData();
                CommonService.showToast('success', 'saved');
            }).catch((error) => {
                $log.error(error);
                CommonService.showToast('error', 'error');
            })
        });
    }

    $scope.editIdAttributeItemValue = (event, idAttributeItemValue, idAttributeType) => {
        $rootScope.openAddEditStaticDataDialog(event, idAttributeItemValue, idAttributeType).then(() => {
            prepareData();
            CommonService.showToast('success', 'saved');
        });
    }

    $scope.editIdAttributeItemDocument = (event, idAttributeItemValue, idAttributeType) => {
        $rootScope.openAddEditDocumentDialog(event, idAttributeItemValue, idAttributeType).then(() => {
            prepareData();
            CommonService.showToast('success', 'saved');
        });
    }

    $scope.openValueDeletePanel = (event, idAttribute, idAttributeItem, idAttributeItemValue) => {
        let itemElement = event.target.parentElement.parentElement;

        let position = $mdPanel
            .newPanelPosition()
            .relativeTo(angular.element(itemElement))
            .addPanelPosition(
                $mdPanel.xPosition.ALIGN_END,
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
                idAttribute: idAttribute,
                idAttributeItem: idAttributeItem,
                idAttributeItemValue: idAttributeItemValue
            }
        }

        $mdPanel.open(config);
    }

    $scope.openFilePreview = (event, item) => {
        if(item && item.documentId){
            RPCService.makeCall('openFileViewer', {documentId: item.documentId});
        }else{
            CommonService.showToast('error', 'documentId is missing');
        }
    }

    $scope.$on('id-attribute:changed', () => {
        prepareData();
    });

    function prepareData() {
        $rootScope.wallet.loadIdAttributes().then(() => {
            $scope.attributesList = [];
            $scope.idDocumentsList = [];

            ID_ATTRIBUTE_TYPES = SqlLiteService.getIdAttributeTypes();
            $scope.idAttributesList = $rootScope.wallet.getIdAttributes();

            if ($scope.idAttributesList) {
                angular.forEach($scope.idAttributesList, (item) => {
                    if (ID_ATTRIBUTE_TYPES[item.idAttributeType].type === 'document') {
                        $scope.idDocumentsList.push(item)
                    } else if (ID_ATTRIBUTE_TYPES[item.idAttributeType].type === 'static_data') {
                        $scope.attributesList.push(item)
                    }
                });

                console.log($scope.idDocumentsList, $scope.attributesList);
            }

            excludeKeys = [];
            for (let i in $scope.idAttributesList) {
                excludeKeys.push($scope.idAttributesList[i].idAttributeType);
            }

            $rootScope.$broadcast('sk-user-info-box:update');
        });
    }
};

function itemValueDeletePanel($rootScope, $scope, $log, mdPanelRef, CommonService, SqlLiteService, idAttribute, idAttributeItem, idAttributeItemValue) {
    'ngInject';

    $scope.promise = null;

    $scope.delete = (event) => {
        $scope.promise = SqlLiteService.deleteIdAttribute(idAttribute);
        $scope.promise.then(() => {
            $rootScope.$broadcast('id-attribute:changed');
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

module.exports = MemberIdWalletMainController;
