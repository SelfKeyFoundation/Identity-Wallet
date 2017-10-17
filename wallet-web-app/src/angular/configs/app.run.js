'use strict';

import $ from 'jquery';

function AppRun($rootScope, $window, $timeout, $http, $mdDialog, DICTIONARY, CONFIG, AnimationService, ElectronService, ConfigStorageService) {
    'ngInject';
    
    AnimationService.init();

    $rootScope.openUrlInNewWindow = function (url) {
        window.open(url)
    }

    $rootScope.test2 = function () {
        window.open("http://token.selfkey.org/");
    }

    $rootScope.test3 = function (event) {
        ElectronService.openUsersDocumentDirectoryChangeDialog(event);
    }

    $timeout(function(){
      $(".sparkley:first").sparkleh();
    }, 2000);

    
    let appOpenCount = ConfigStorageService.getAppOpenCount();
    let userDocumentsStoragePath = ConfigStorageService.getUserDocumentsStoragePath();

    if(!appOpenCount || appOpenCount === 0){
        $timeout(function(){
            $mdDialog.show({
                templateUrl: 'common/dialogs/legal-tems-and-conditions.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: false
            }).then(function(){
                if (!userDocumentsStoragePath && ElectronService.ipcRenderer) {
                    $mdDialog.show({
                        templateUrl: 'common/dialogs/user-documents-storage-path.html',
                        controller: 'UserDocumentsStoragePathDialog',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        fullscreen: false
                    });
                }
            });
        }, 1000);
    }

    appOpenCount++;
    ConfigStorageService.setAppOpenCount(appOpenCount);
}

export default AppRun;