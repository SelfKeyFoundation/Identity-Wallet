function MemberSettingsMainController ($rootScope, $scope, $log, CONFIG, ConfigStorageService) {
    'ngInject'

    $log.debug("MemberSettingsMainController", ConfigStorageService);

    $scope.settings = ConfigStorageService;
    

    

    $log.debug("ConfigStorageService");
};

export default MemberSettingsMainController;
