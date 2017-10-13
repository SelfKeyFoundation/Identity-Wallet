function MemberIdentityMainController ($rootScope, $scope) {
    'ngInject'

    $scope.contactItems = [
        {
            type: "Phone",
            value: "+58 441 334 92 67",
            status: "verified",
            privacy: "private"
        },
        /*
        {
            type: "Phone",
            value: "+58 441 334 92 67",
            status: "verify",
            privacy: "private"
        },
        */
        {
            type: "Email",
            value: "cbruguera@gmail.com",
            status: "verified",
            privacy: "public"
        }
    ];

    $scope.documentItems = [
        {
            type: "Passport",
            name: "US Passport",
            attestation: "verified",
            privacy: "private"
        },
        {
            type: "Passport",
            name: "Passatore Venezolano",
            attestation: "Request Attestation",
            privacy: "private"
        },
        {
            type: "Passport",
            name: "Cedula De Identidad",
            attestation: "verified",
            privacy: "public"
        }
    ];
};

export default MemberIdentityMainController;
