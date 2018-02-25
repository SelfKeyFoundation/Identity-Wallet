"use strict";

function SkUserInfoBoxDirective($rootScope, $log, $window, $timeout, ConfigFileService) {
	"ngInject";

	return {
		restrict: "E",
		scope: {},
		link: (scope, element) => {
			scope.userData = {
				email: "",
				name: "",
				country_of_residency: "",
				tempImage: "assets/images/temp/avatar.jpg"
			};

            let idAttributes = ConfigFileService.getIdAttributesStore();

            reloadData();

            function reloadData() {
                for (let i in idAttributes) {
                    let item = idAttributes[i];

                    if(item.items[item.defaultItemId].values.length <= 0) {
                        continue;
                    }

                    scope.userData[i] = item.items[item.defaultItemId].values[0].value;
                    if(item.type === "name"){
                        if(item.items[item.defaultItemId].values[1]){
                            scope.userData[i] += " " + item.items[item.defaultItemId].values[1].value;
                        }
                    }
                }
            }
        },
        replace: true,
        templateUrl: 'common/directives/sk-user-info-box.html'
    }
}

module.exports = SkUserInfoBoxDirective;
