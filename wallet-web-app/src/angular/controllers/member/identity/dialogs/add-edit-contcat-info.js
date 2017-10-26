function AddEditContactInfoDialog($rootScope, $scope, $log, $mdDialog, IndexedDBService, contactInfoRecord, contactItem) {
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
            for (let i in contactInfoRecord.data) {
                let item = contactInfoRecord.data[i];
                if (item.id === contactItem.id) {
                    contactInfoRecord.data[i] = $scope.contactInfo;
                    break;
                }
            }
        } else {
            // add
            $scope.contactInfo.id = IndexedDBService.generateId();
            contactInfoRecord.data.push($scope.contactInfo);
        }

        let promise = IndexedDBService.contactInfos_save(contactInfoRecord);
        promise.then((result) => {
            $mdDialog.hide(contactInfoRecord.data);
        });
    }
};

export default AddEditContactInfoDialog;
