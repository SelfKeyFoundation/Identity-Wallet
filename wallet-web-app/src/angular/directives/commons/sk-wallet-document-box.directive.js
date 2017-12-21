'use strict';

// TODO - rename sk-id-attribute-box(data="", callbacks="")
function SkWalletDocumentBoxDirective($log, $window, $mdDialog) {
    'ngInject';

    return {
        restrict: 'E',
        scope: {
            data: "="
        },
        link: (scope, element, attrs, tabsCtrl) => {
            scope.config = { historyRowCount: 2 };

            // item type
            // scope.data.type = 'document' | 'static_data'
            
            // show only defaults or show all
            // scope.data.mode = 'default' | 'all'

            // view state: add/edit/delete
            // TODO - rename to viewState
            //scope.mode = 1; // 'default' | 'edit'
            scope.attrToAdd = {};

            scope.changeMode = function(mode, newItem){
                
                $mdDialog.show({
                    templateUrl: 'common/directives/test.html',
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: false,
                    fullscreen: true
                }).then((resp)=>{

                })

                /*
                if(newItem){
                    let clone = angular.copy(newItem);
                    clone.actionHistory = [{
                        date: new Date(),
                        status: 1,
                        note: "File required"
                    }];
                    scope.data.documents.splice(0, 0, clone);
                }
                scope.attrToAdd = {};
                scope.data.viewState = mode;
                */
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
                if(!files || !files.length) return '';
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