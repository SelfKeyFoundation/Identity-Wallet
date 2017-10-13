function MemberProfileController ($rootScope, $scope, $stateParams, $transitions) {
    'ngInject'

    console.log("test", $transitions)    

    $transitions.onSuccess({to: true}, function ($state) {
        console.log("test 2222", $stateParams)  
        $scope.companyId =  $stateParams.companyId;
        $scope.$apply();
    });
};

export default MemberProfileController;
