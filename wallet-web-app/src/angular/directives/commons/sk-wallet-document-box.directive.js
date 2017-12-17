'use strict';

function SkWalletDocumentBoxDirective($log, $window, $mdDialog) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: (scope, element, attrs, tabsCtrl) => {
            scope.mode = 1;
            scope.attrToAdd = {};

            scope.changeMode = function(mode, newItem){
                if(newItem){
                    let clone = angular.copy(newItem);
                    clone.actionHistory = [{
                        date: new Date(),
                        status: 1,
                        note: "File required",
                        actions: [
                            {
                                title: 'request verification',
                                link: '/app/verify?docId=789'
                            }
                        ]
                    }];
                    scope.data.documents.splice(0, 0, clone);
                }
                scope.attrToAdd = {};
                scope.mode = mode;
            };

            scope.statuses = {
                1: new DocumentProcessStatus(1, 'Needs verification', 'warning-box'),
                2: new DocumentProcessStatus(2, 'Verified', 'success-box'),
                3: new DocumentProcessStatus(3, 'Rejected', 'danger-box')
            };

            scope.deleteAttribute = function (attrIndex) {
                scope.data.documents.splice(attrIndex, 1);
            };

            scope.getFileNames = function(files){
                return files.map(file=>file.name).join(', ');
            };

            console.log('passed data is:', scope.data);
        },
        replace: true,
        templateUrl: 'common/directives/sk-wallet-document-box.html'
    }
}

function DocumentProcessStatus(status, name, icon) {
    this.status = status;
    this.name = name;
    this.icon = icon;
}

export default SkWalletDocumentBoxDirective;