'use strict';

function ScrollToEndDirective($log, $window) {
	'ngInject';

	function getStyleInt(elem, prop) {
		try {
			return parseInt(window.getComputedStyle(elem, null).getPropertyValue(prop), 10);
		} catch (e) {
			return parseInt(elem.currentStyle[prop], 10);
		}
	}

	// Get the 'innerHeight' equivalent for a non-window element, including padding
	function getElementDimension(elem, prop) {
		switch (prop) {
			case 'width':
				return (
					getStyleInt(elem, 'width') +
					getStyleInt(elem, 'padding-left') +
					getStyleInt(elem, 'padding-right')
				);
			case 'height':
				return (
					getStyleInt(elem, 'height') +
					getStyleInt(elem, 'padding-top') +
					getStyleInt(elem, 'padding-bottom')
				);
		}
	}

	return {
		restrict: 'A',
		scope: {
			callback: '=scrollToEnd'
		},
		link: (scope, elem, attr) => {
			var callback = scope.callback || function() {};
			var boundToWindow = attr.bindToWindow;
			var body = document.body;
			var html = document.documentElement;
			var boundElement = boundToWindow ? angular.element($window) : elem;
			var oldScrollX = 0;
			var oldScrollY = 0;
			var handleScroll = function() {
				// Dimensions of the content, including everything scrollable
				var contentWidth;
				var contentHeight;
				// The dimensions of the container with the scrolling, only the visible part
				var viewportWidth;
				var viewportHeight;
				// The offset of how much the user has scrolled
				var scrollX;
				var scrollY;

				if (boundToWindow) {
					// Window binding case - Populate Dimensions
					contentWidth = Math.max(
						body.scrollWidth,
						body.offsetWidth,
						html.clientWidth,
						html.scrollWidth,
						html.offsetWidth
					);
					contentHeight = Math.max(
						body.scrollHeight,
						body.offsetHeight,
						html.clientHeight,
						html.scrollHeight,
						html.offsetHeight
					);
					viewportWidth = window.innerWidth;
					viewportHeight = window.innerHeight;
					scrollX = (window.pageXOffset || html.scrollLeft) - (html.clientLeft || 0);
					scrollY = (window.pageYOffset || html.scrollTop) - (html.clientTop || 0);
				} else {
					// DOM element case - Populate Dimensions
					var domElement = boundElement[0];
					contentWidth = domElement.scrollWidth;
					contentHeight = domElement.scrollHeight;
					viewportWidth = getElementDimension(domElement, 'width');
					viewportHeight = getElementDimension(domElement, 'height');
					scrollX = domElement.scrollLeft;
					scrollY = domElement.scrollTop;
				}

				scrollY = Math.ceil(scrollY);
				scrollX = Math.ceil(scrollX);

				var scrollWasInXDirection = oldScrollX !== scrollX;
				var scrollWasInYDirection = oldScrollY !== scrollY;
				oldScrollX = scrollX;
				oldScrollY = scrollY;
				if (scrollWasInYDirection && scrollY <= 0) {
					callback('top');
				} else if (scrollWasInYDirection && scrollY >= contentHeight - viewportHeight) {
					callback('bottom');
				} else if (scrollWasInXDirection && scrollX === 0) {
					callback('left');
				} else if (scrollWasInXDirection && scrollX === contentWidth - viewportWidth) {
					callback('right');
				}
			};
			boundElement.bind('scroll', handleScroll);
			// Unbind the event when scope is destroyed
			scope.$on('$destroy', function() {
				boundElement.unbind('scroll', handleScroll);
			});
		}
	};
}
ScrollToEndDirective.$inject = ['$log', '$window'];
module.exports = ScrollToEndDirective;
