'use strict';
function SkCirclePieChartDirective($state) {
	'ngInject';

	return {
		restrict: 'E',
		scope: {
			data: '='
		},
		link: (scope, element) => {
			scope.navigateToManageCryptos = () => {
				$state.go('member.wallet.manage-cryptos');
			};
		},
		replace: true,
		templateUrl: 'common/directives/sk-circle-pie-chart.html'
	};
}
SkCirclePieChartDirective.$inject = ['$state'];
module.exports = SkCirclePieChartDirective;
