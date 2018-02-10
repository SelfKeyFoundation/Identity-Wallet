
function MemberSetupAddDocumentController($rootScope, $scope, $log, $state) {
    'ngInject'

    $scope.nextStep = (event) => {
        $state.go('member.setup.add-document', {type: 'id_document'});
    }
};

module.exports = MemberSetupAddDocumentController;