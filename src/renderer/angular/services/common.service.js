'use strict';

const Wallet = require('../classes/wallet');
const CommonUtils = require('../classes/common-utils');

function CommonService($rootScope, $log, $q, $mdDialog, $compile, $mdToast) {
	'ngInject';

	$log.debug('CommonService Initialized');

	class CommonService {
		constructor() {
			Wallet.CommonService = this;
			Wallet.$q = $q;
		}

		showToast(type, text, delay, headerText) {
			delay = delay || 3000;

			$mdToast.show({
				hideDelay: delay,
				position: 'top right',
				controller: 'ToastController',
				templateUrl: 'common/toast.html',
				locals: {
					message: text,
					type: type,
					headerText: headerText
				}
			});
		}

		generateId() {
			let m = Math;
			let d = Date;
			let h = 16;
			let s = s => m.floor(s).toString(h);

			return s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
		}

		numbersAfterComma(num, fixed) {
			var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
			return num.toString().match(re)[0];
		}

		formattedLocaleNumberToNumber(stringNumber) {
			var thousandSeparator = (1111).toLocaleString().replace(/1/g, '');
			var decimalSeparator = (1.1).toLocaleString().replace(/1/g, '');

			return parseFloat(
				stringNumber
					.replace(new RegExp('\\' + thousandSeparator, 'g'), '')
					.replace(new RegExp('\\' + decimalSeparator), '.')
			);
		}

		// 123123481283
		// commasAfterNumber(amount, num) {
		//     console.log("commasAfterNumber", amount, num);
		//     let result = "";
		//     const array = amount.toString().split('');
		//
		//     let counter = 1;
		//     for (let i = array.length - 1; i >= 0; i--) {
		//         if (i % num === 0) {
		//             result = "," + result;
		//         } else {
		//             result = array[i] + result;
		//         }
		//         counter
		//     }
		//
		//     return result;
		// }

		commasAfterNumber(amount, num) {
			var parts = amount.toString().split('.');
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			return parts.join('.');
		}

		chunkArray(myArray, chunkSize) {
			return CommonUtils.chunkArray(myArray, chunkSize);
		}

		isInt(n) {
			return n % 1 === 0;
		}

		getFormattedValueUSD(value) {
			let valueUSD = Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD'
			}).format(value);

			// It will round correctly but we need to remove symbol because of the pie chart calculation
			valueUSD = valueUSD.substr(1, valueUSD.length - 1);
			return valueUSD;
		}
	}

	return new CommonService();
}
CommonService.$inject = ['$rootScope', '$log', '$q', '$mdDialog', '$compile', '$mdToast'];
module.exports = CommonService;
