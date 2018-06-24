'use strict';

function SkButtonLoadingDirective($log, $compile) {
	'ngInject';

	return {
		restrict: 'A',
		priority: 1,
		scope: {
			skButtonLoading: '='
		},
		link: {
			pre: function(scope, elem, attr) {
				scope.isProcessing = false;

				function onClick(e) {
					if (scope.isProcessing) {
						e.preventDefault();
						e.stopImmediatePropagation();
						return false;
					} else {
						return true;
					}
				}

				elem.on('click', onClick);
				scope.$on('$destroy', function() {
					elem.off('click', onClick);
				});
			},
			post: function(scope, elem, attr) {
				var innerHtml = angular.copy(elem.html());

				scope.$watch(
					'skButtonLoading',
					function(newValue, oldValue) {
						if (newValue === null || newValue === undefined) return;
						if (typeof newValue === 'boolean') {
							if (newValue) {
								elem.html('Please Wait...');
								elem.attr('disabled', 'disabled');
								scope.isProcessing = true;
							} else {
								elem.html(innerHtml);
								elem.removeAttr('disabled');
								scope.isProcessing = false;
								$compile(elem.contents())(scope);
							}
						} else if (typeof newValue == 'number') {
							switch (newValue) {
								case 0:
									elem.html('Please Wait...');
									elem.attr('disabled', 'disabled');
									scope.isProcessing = true;
									break;
								default:
									elem.html(innerHtml);
									elem.removeAttr('disabled');
									scope.isProcessing = false;
									$compile(elem.contents())(scope);
							}
						}
					},
					true
				);
			}
		}
	};
}
SkButtonLoadingDirective.$inject = ['$log', '$compile'];
module.exports = SkButtonLoadingDirective;
