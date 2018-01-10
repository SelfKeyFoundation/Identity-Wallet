function MemberSetupChooseController($rootScope, $scope, $log, ElectronService) {
    'ngInject'



    $scope.importIdentity = () => {

        let promise = ElectronService.openFileSelectDialog();
        promise.then((file) => {
            console.log(file);
            ElectronService.importKYCIdentity(file).then(function(resp){
                console.log(resp)
            })
        });
    }


};

export default MemberSetupChooseController;