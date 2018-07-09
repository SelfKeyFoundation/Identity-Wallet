'use strict';

function Usd($document, $timeout) {
	'ngInject';

	return function(input) {
		input = input || 0.0;

		return input;
	};
}
Usd.$inject = ['$document', '$timeout'];
module.exports = Usd;
