function MemberSettingsMainController ($rootScope, $scope, $log, CONFIG, ConfigStorageService, CommonService) {
    'ngInject'

    $log.debug("MemberSettingsMainController", ConfigStorageService);

    $scope.settings = ConfigStorageService;
    

    $scope.openChooseUserDirectory = function (event) {
        CommonService.openChooseUserDirectoryDialog();
    }
    

    $log.debug("ConfigStorageService");
};

export default MemberSettingsMainController;
