const IdAttribute = requireAppModule('angular/classes/id-attribute');

function MemberIdWalletMainController($rootScope, $scope, $log, $mdDialog, SqlLiteService) {
    'ngInject'

    $log.info('MemberIdWalletMainController');


    $scope.attributesList = [];
    $scope.idDocumentsList = [];


    let ID_ATTRIBUTE_TYPES = SqlLiteService.getIdAttributeTypes();
    $scope.idAttributesList = $rootScope.wallet.getIdAttributes();

    if ($scope.idAttributesList) {
        angular.forEach($scope.idAttributesList, function (item) {
            if (ID_ATTRIBUTE_TYPES[item.idAttributeType].type === 'document') {
                $scope.idDocumentsList.push(item)
            } else if (ID_ATTRIBUTE_TYPES[item.idAttributeType].type === 'static_data') {
                $scope.attributesList.push(item)
            }
        })
    }


    $scope.idAttrbuteConfig = {}

    let excludeTypes = [];
    for (let i in $scope.idAttributesList) {
        excludeTypes.push($scope.idAttributesList[i].type)
    }

    /**
     * 1: load IdAttributesType List
     * 2: load user's IdAttribute List
     * 3: render user's IdAttribute List
     */

    $scope.addIdAttribute = (event) => {
        $mdDialog.show({
            controller: "AddIdAttributeDialogController",
            templateUrl: "common/dialogs/add-id-attribute.html",
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                excludeTypes: excludeTypes
            }
        }).then((selectedIdAttributeType) => {
            /*
            let idAttributesStore = ConfigFileService.getIdAttributesStore();

            if (!idAttributesStore[selectedIdAttributeType.key]) {
                let idAttribute = new IdAttribute(selectedIdAttributeType.key);
                idAttributesStore[selectedIdAttributeType.key] = idAttribute;
            }
            excludeTypes.push(selectedIdAttributeType.key)

            $log.info('selected id attribute type:', idAttributesStore);
            */
        });
    }


};

module.exports = MemberIdWalletMainController;
