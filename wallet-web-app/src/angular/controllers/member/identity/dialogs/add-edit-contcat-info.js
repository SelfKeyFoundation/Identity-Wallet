function AddEditContactInfoDialog($rootScope, $scope, $log, $mdDialog, ConfigFileStoreService, contactInfoRecord, contactItem) {
    'ngInject'

    $log.info('AddEditContactInfoDialog');

    $scope.contactInfo = {
        status: 0
    };

    if (contactItem) {
        angular.extend($scope.contactInfo, contactItem);
    }

    $scope.cancel = (event) => {
        $mdDialog.cancel();
    }

    $scope.save = (event) => {
        $log.info('target contactInfo to save', $scope.contactInfo);
        $log.info('contactInfoRecord', contactInfoRecord);

        //if (typeof $scope.contactInfo.privacy === 'string') {
        //    $scope.contactInfo.privacy = $scope.contactInfo.privacy === '1' ? 1 : 0;
        //}

        if (contactItem) {
            // edit
            for (let i in contactInfoRecord) {
                let item = contactInfoRecord[i];
                if (item.id === contactItem.id) {
                    contactInfoRecord[i] = $scope.contactInfo;
                    break;
                }
            }
        } else {
            // add
            $scope.contactInfo.id = ConfigFileStoreService.generateId();
            contactInfoRecord.push($scope.contactInfo);
        }
        
        // TODO: get active key

        let promise = ConfigFileStoreService.contactInfos_save("0x5abb838bbb2e566c236f4be6f283541bf8866b68", contactInfoRecord);
        promise.then((result) => {
            $mdDialog.hide(contactInfoRecord);
        });
    }
};

export default AddEditContactInfoDialog;
