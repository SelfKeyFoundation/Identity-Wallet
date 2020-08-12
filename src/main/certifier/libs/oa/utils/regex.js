'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var VerEx = require('verbal-expressions');
var hexDigits = VerEx().range('0', '9', 'a', 'f', 'A', 'F');
var hexString = VerEx()
	.then('0x')
	.then(hexDigits)
	.oneOrMore();
exports.isHexString = function(input) {
	var testRegex = VerEx()
		.startOfLine()
		.then(hexString)
		.endOfLine();
	return testRegex.test(input);
};
