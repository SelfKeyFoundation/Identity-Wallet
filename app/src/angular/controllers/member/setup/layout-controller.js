'use strict';

function MemberSetupLayoutController($rootScope, $scope, $log, $state, ConfigFileService) {
    'ngInject'

    $log.info('MemberSetupLayoutController');

    $scope.idDocument = getIdAttributeItemValues('national_id');
    $scope.idSelfie = getIdAttributeItemValues('id_selfie');

    $scope.skip = (event) => {
        let store = ConfigFileService.getStore();
        let wallet = store.wallets[$rootScope.wallet.getPublicKeyHex()];

        if ($scope.idDocument.length === 0) {
            let alert = buildMissingIdAttributeAlert('warning', 'Action Reuired', 'ID Document Missing', 'id_document');
            wallet.data.alerts.push(alert);
        }

        if ($scope.idSelfie.length === 0) {
            let alert = buildMissingIdAttributeAlert('warning', 'Action Reuired', 'Selfie With ID Missing', 'id_selfie');
            wallet.data.alerts.push(alert);
        }

        ConfigFileService.save().then(() => {
            $state.go('member.dashboard.main');
        });
    }

    /**
     *
     */
    function getIdAttributesStore() {
        let store = ConfigFileService.getStore();
        let walletData = store.wallets[$rootScope.wallet.getPublicKeyHex()];
        return walletData.data.idAttributes;
    }

    function getIdAttributeItem(type) {
        let idAttributesStore = getIdAttributesStore();
        let idAttribute = idAttributesStore[type];
        return idAttribute.items[idAttribute.defaultItemId];
    }

    function getIdAttributeItemValues(type) {
        let item = getIdAttributeItem(type);
        return item.values;
    }

    function buildMissingIdAttributeAlert(type, text1, text2, idAttributeType) {
        return {
            type: 'warning',
            text1: 'Action reuired',
            text2: 'ID Document Missing',
            createdAt: new Date(),
            actions: [{
                label: 'Add',
                action: 'add',
                targetType: 'id_attribute',
                targetId: idAttributeType
            }]
        };
    }
};

module.exports = MemberSetupLayoutController;
