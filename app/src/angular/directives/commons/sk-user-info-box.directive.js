'use strict';

function SkUserInfoBoxDirective($rootScope, $log, $window, $timeout, $filter, SqlLiteService, RPCService, CommonService) {
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

            let idAttributeTypes = SqlLiteService.getIdAttributeTypes();

            scope.idAttributes = {};
            prepareData();

            scope.$on('sk-user-info-box:update', () => {
                prepareData();
            });

            scope.openDocumentAddEditModal = (event, idAttribute) => {
                let idAttributes = $rootScope.wallet.getIdAttributes();
                $rootScope.$broadcast('id-attribute:open-document-add-dialog', idAttributes[idAttribute.key].items[0].values[0], idAttribute.key);
            }

            scope.getItemValue = (item) => {
                if(item.type === 'document' && item.documentFileName){
                    return 'Uploaded';
                }

                switch(item.key){
                    case 'birthdate':
                        return $filter('date')(Number(item.staticData.line1), 'yyyy/MM/dd');
                        break;
                    case 'work_place':
                    case 'physical_address':
                        let value = item.staticData.line1 + ", ";

                        if(item.staticData.line2){
                            value += item.staticData.line2 + ", ";
                        }

                        value += item.staticData.line3 + ", ";
                        value += item.staticData.line4 + ", ";
                        value += item.staticData.line5 + ", ";
                        value += item.staticData.line6;

                        return value
                        break;
                    case 'phonenumber_countrycode':
                        return item.staticData.line1 + " " + item.staticData.line2
                        break;
                    default:
                        return item.staticData.line1
                }
            }

            function prepareData() {
                scope.idAttributes = {};

                let idAttributes = $rootScope.wallet.getIdAttributes();


                for (let i in idAttributes) {
                    scope.idAttributes[i] = {
                        key: i,
                        type: idAttributeTypes[i].type,
                        staticData: idAttributes[i].items[0].values[0].staticData,
                        documentFileName: idAttributes[i].items[0].values[0].documentFileName
                    }
                }
            }

            // profile picture start 

            let updateProfilePictureStyles = (profilePicture) => {
                //binary
                scope.profilePictureStyles = {
                    'background-image':  !profilePicture ? `url(${scope.userData.tempImage})` : `url("data:image/gif;base64,${profilePicture}")`
                };
            };
            
            updateProfilePictureStyles();

            RPCService.makeCall('getWalletProfilePictureId', {
                id: $rootScope.wallet.id
            }).then((profilePicture)=>{
                updateProfilePictureStyles(profilePicture);
            });

            let updateWalletprofilePicture = (profilePicture) => {
                let data = {
                    id: $rootScope.wallet.id,
                    profilePicture: profilePicture
                }
                RPCService.makeCall('updateWalletprofilePicture',data).then((res)=> {
                    updateProfilePictureStyles(res.profilePicture);
                }).catch((err)=> {
                    CommonService.showToast('error', 'Error while saving the file');
                });
            };

            scope.selectProfilePicture = (event) => {
                let fileSelect = RPCService.makeCall('openFileSelectDialog', {
                    filters: [
                        { name: 'Documents', extensions: ['jpg', 'jpeg', 'png'] }, 
                    ],
                    maxFileSize: 50 * 1000 * 1000
                });
                fileSelect.then((selectedFile) => {
                    let profilePicture = selectedFile.buffer.toString('base64'); 
                    updateWalletprofilePicture(profilePicture);
                }).catch((error) => {
                    CommonService.showToast('error', 'Maximum file size: The file could not be uploaded. The file exceeds the maximum upload size. Please upload file no larger than 50 MB.');
                });
            };

            // profile picture  end
        },
        replace: true,
        templateUrl: 'common/directives/sk-user-info-box.html'
    }
}

module.exports = SkUserInfoBoxDirective;
