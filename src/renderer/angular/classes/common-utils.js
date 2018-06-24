'use strict';

class CommonUtils {
	constructor() {}

	static hexToAscii(hex) {
		return hex
			.match(/.{1,2}/g)
			.map(function(v) {
				return String.fromCharCode(parseInt(v, 16));
			})
			.join('');
	}

	static isAlphaNumeric(value) {
		return !/[^a-zA-Z0-9]/.test(value);
	}

	static isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	static generateId() {
		let m = Math;
		let d = Date;
		let h = 16;
		let s = s => m.floor(s).toString(h);

		return s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
	}

	static chunkArray(myArray, chunkSize) {
		let index = 0;
		let arrayLength = myArray.length;
		let tempArray = [];

		for (index = 0; index < arrayLength; index += chunkSize) {
			let myChunk = myArray.slice(index, index + chunkSize);
			tempArray.push(myChunk);
		}

		return tempArray;
	}
}

module.exports = CommonUtils;
