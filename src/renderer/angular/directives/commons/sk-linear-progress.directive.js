'use strict';

function SkLinearProgressDirective() {
	'ngInject';
	return {
		restrict: 'E',
		scope: {
			maxValue: '@',
			value: '@',
			completedPercent: '='
		},
		link: (scope, element) => {
			var progressPercent = null;
			scope.isNotLoop = scope.maxValue && scope.value;
			if (scope.isNotLoop) {
				let perc = (scope.value * 100) / scope.maxValue;
				scope.progressPercent = perc + '%';
				scope.completedPercent = Math.floor(perc);
			}
		},
		replace: true,
		templateUrl: 'common/directives/sk-linear-progress.html'
	};
}

module.exports = SkLinearProgressDirective;
