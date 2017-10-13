'use strict';

import $ from 'jquery';

function AppRun($rootScope, $window, $timeout, DICTIONARY, CONFIG, AnimationService, $http, localStorageService, $mdDialog) {
    'ngInject';
    
    AnimationService.init();

    $rootScope.openUrlInNewWindow = function (url) {
        window.open(url)
    }

    $rootScope.test2 = function () {
        window.open("http://token.selfkey.org/");
    }

    $timeout(function(){
      $(".sparkley:first").sparkleh();
    }, 2000);

    let appOpenCount = localStorageService.get("appOpenCount");
    if(!appOpenCount || appOpenCount === 0){
        $timeout(function(){
            $mdDialog.show({
                templateUrl: 'common/dialogs/legal-tems-and-conditions.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: true
            });
        }, 1000);
    }
    appOpenCount++;
    localStorageService.set("appOpenCount", appOpenCount);
    
    // localStorageService.get(key);
}

export default AppRun;