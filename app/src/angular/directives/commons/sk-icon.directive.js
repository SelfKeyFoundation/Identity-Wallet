"use strict";

function SkIconDirective($log) {
	"ngInject";

	return {
		restrict: "E",
		scope: {
			icon: "@",
			sizeClass: "@"
		},
		link: (scope, element) => {},
		replace: true,
		templateUrl: "common/directives/sk-icon.html"
	};
}

module.exports = SkIconDirective;
