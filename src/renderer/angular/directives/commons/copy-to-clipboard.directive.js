'use strict';

function CopyToClipboardDirective($document, $timeout) {
	'ngInject';
	const animationDuration = 500;

	return {
		restrict: 'A',
		scope: {
			copyToClipboard: '=',
			copyAnimation: '@'
		},
		replace: false,
		link: (scope, element) => {
			// default : fadeUp
			let copyAnimation = scope.copyAnimation || 'default';
			let originalText = null;

			switch (copyAnimation) {
				case 'default':
					originalText = angular.copy(element.html());
					break;
				case 'fadeUp':
					angular.element(element[0]).css({ position: 'relative' });
					break;
			}

			element.bind('click', function(e) {
				let fadeUpEl = null;

				let messageElement = angular.element(
					'<textarea class="copy-to-clipboard selection">' +
						scope.copyToClipboard +
						'</textarea>'
				);
				$document[0].body.append(messageElement[0]);

				switch (copyAnimation) {
					case 'default':
						element.html('COPIED');
						break;
					case 'fadeUp':
						fadeUpEl = angular.element(
							'<div class="copy-to-clipboard-msg">Copied</div>'
						);
						element[0].append(fadeUpEl[0]);
						break;
				}

				$timeout(() => {
					messageElement[0].remove();

					switch (copyAnimation) {
						case 'default':
							element.html(originalText);
							break;
						case 'fadeUp':
							fadeUpEl[0].remove();
							break;
					}
				}, animationDuration);

				messageElement[0].select();
				document.execCommand('copy');
			});
		}
	};
}
CopyToClipboardDirective.$inject = ['$document', '$timeout'];
module.exports = CopyToClipboardDirective;
