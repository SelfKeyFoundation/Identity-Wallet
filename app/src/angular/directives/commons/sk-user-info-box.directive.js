'use strict';

function SkUserInfoBoxDirective($rootScope, $log, $window, $timeout, ConfigFileService) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {},
        link: (scope, element) => {
            scope.userData = {
                email: "",
                name: "",
                country_of_residency: "",
                tempImage: 'assets/images/temp/avatar.jpg'
            }

            let store = ConfigFileService.getStore();
            let idAttributes = store.wallets[$rootScope.wallet.getPublicKeyHex()].data.idAttributes;

            reloadData();

            function reloadData() {
                for (let i in idAttributes) {
                    let item = idAttributes[i];
                    scope.userData[i] = item.items[item.defaultItemId].values[0];
                }
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-user-info-box.html'
    }
}

module.exports = SkUserInfoBoxDirective;
