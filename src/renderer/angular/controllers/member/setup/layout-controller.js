'use strict';
const { Logger } = require('common/logger');
const log = new Logger('MemberSetupLayoutController');
function MemberSetupLayoutController($rootScope, $scope, $state) {
	'ngInject';

	log.info('MemberSetupLayoutController');
}
MemberSetupLayoutController.$inject = ['$rootScope', '$scope', '$state'];
module.exports = MemberSetupLayoutController;
