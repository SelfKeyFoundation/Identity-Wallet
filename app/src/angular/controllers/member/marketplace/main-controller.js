'use strict';

function MemberMarketplaceMainController($rootScope, $scope, $log, $timeout, $mdDialog, $mdPanel, SqlLiteService, CommonService, RPCService) {
    'ngInject'

    $log.info('MemberMarketplaceMainController');

    $scope.marketplaceData = [
        {
            title: 'Gatecoin',
            description: 'asdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcf' +
            'asdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezxcfasdqwezx9990000',
            available: true,
            logo:'gatecoin'
        },
        {
            title: 'Wandx',
            description: 'asdlajdhlkqwehlkqhdkjahsdlkjdaksdlaksjd',
            available: false
        },
        {
            title: 'cyber network',
            description: 'asdlajdhlkqwehlkqhdkjahsdlkjdaksdlaksjd',
            available: false
        },
        {
            title: 'TagCash',
            description: 'asdlajdhlkqwehlkqhdkjahsdlkjdaksdlaksjd',
            available: false
        },
        {
            title: 'something',
            description: 'asdlajdhlkqwehlkqhdkjahsdlkjdaksdlaksjd',
            available: false
        }
    ]

};

module.exports = MemberMarketplaceMainController;
