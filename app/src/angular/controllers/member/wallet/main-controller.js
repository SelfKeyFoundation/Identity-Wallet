function MemberWalletMainController($rootScope, $scope, $log, $q, $timeout, $mdDialog, $mdSidenav, ConfigFileService, CommonService, ElectronService, EtherScanService) {
    'ngInject'

    $log.info('MemberWalletMainController');
    let now = new Date();

    $scope.docBoxData = {
        name: "National ID",
        acceptableDocuments: "You can upload documents which at least contain your personal number, first name, last name, birth date and photo",
        documents: [
            {
                name: 'ID Card',
                files: [{name: 'Robert_Plant_id.jpg'}],
                actionHistory: [
                    {
                        date: new Date(now - 10000000),
                        status: 1,
                        note: "shared with bitDegree testing long text",
                        actions: [
                            /*
                            {
                                title: 'request verification',
                                link: '/app/verify?docId=789'
                            }
                            */
                        ]
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 2,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 2,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain",
                        actions: []
                    }
                ]
            },
            {
                name: 'ID Card',
                files: [{name: 'John_id.jpg'}],
                actionHistory: [
                    {
                        date: new Date(now - 10000000),
                        status: 1,
                        note: "shared with bitDegree",
                        actions: [
                            {
                                title: 'request verification',
                                link: '/app/verify?docId=789'
                            }
                        ]
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 2,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 2,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain",
                        actions: []
                    }
                ]
            },
        ],
    };

    $scope.addIdAttribute = (event) => {
        /*
        $mdDialog.show({
            controller: AddIdAttributeDialog,
            templateUrl: 'common/dialogs/add-id-attribute.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true,
            locals: {
                config: {
                    title: "Upload your " + item.idAttributeType.key,       // todo
                    type: item.idAttributeType.type,                        // document, static_data
                    key: item.idAttributeType.key
                },
                item: angular.copy(item)
            }
        }).then((respItem) => {
            item.name = item.name;
            item.value = item.value;
            item.path = item.path;
            item.size = item.size;
            item.contentType = item.contentType;

            if (!store.idAttributes[item.idAttributeType.key]) {
                store.idAttributes[item.idAttributeType.key] = scope.data;
            }

            let itemToSave = store.idAttributes[item.idAttributeType.key].items[respItem._id];

            itemToSave.name = respItem.name;
            itemToSave.value = respItem.value;
            if (scope.data.type === 'document') {
                itemToSave.size = respItem.size;
                itemToSave.contentType = respItem.contentType;
            }

            $log.info('store to save:', store);
            //$rootScope.$broadcast('id-attributes-changed', scope.data);


            ConfigFileService.save().then((resp) => {
                // show message
                if (scope.config.callback && scope.config.callback.itemChanged) {
                    scope.config.callback.itemChanged(scope.data);
                }

                $rootScope.$broadcast('id-attributes-changed', scope.data);
            });
        });
        */
    }


    loadIdAttributes ();

    function loadIdAttributes () {
        let store = ConfigFileService.getStore();
        let idAttributes = store.idAttributes;

        $scope.allIdAttributesList = idAttributes;
    }

    $rootScope.$on('id-attributes-changed', (event) => {
        let store = ConfigFileService.getStore();
        $scope.allIdAttributesList = store.idAttributes;
    });
};

export default MemberWalletMainController;