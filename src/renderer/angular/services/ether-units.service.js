'use strict';

function EtherUnits($rootScope, $log, $http) {
	'ngInject';

	$log.info('EtherUnits Initialized');

	const UNIT_MAP = {
		wei: '1',
		kwei: '1000',
		ada: '1000',
		femtoether: '1000',
		mwei: '1000000',
		babbage: '1000000',
		picoether: '1000000',
		gwei: '1000000000',
		shannon: '1000000000',
		nanoether: '1000000000',
		nano: '1000000000',
		szabo: '1000000000000',
		microether: '1000000000000',
		micro: '1000000000000',
		finney: '1000000000000000',
		milliether: '1000000000000000',
		milli: '1000000000000000',
		ether: '1000000000000000000',
		kether: '1000000000000000000000',
		grand: '1000000000000000000000',
		einstein: '1000000000000000000000',
		mether: '1000000000000000000000000',
		gether: '1000000000000000000000000000',
		tether: '1000000000000000000000000000000'
	};

	/**
	 *
	 */
	class EtherUnits {
		constructor() {}

		getValueOfUnit(unit) {
			unit = unit ? unit.toLowerCase() : 'ether';
			let unitValue = UNIT_MAP[unit];
			if (unitValue === undefined) {
				throw new Error(globalFuncs.errorMsgs[4] + JSON.stringify(UNIT_MAP, null, 2));
			}
			return new BigNumber(unitValue, 10);
		}

		fiatToWei(number, pricePerEther) {
			let returnValue = new BigNumber(String(number))
				.div(pricePerEther)
				.times(this.getValueOfUnit('ether'))
				.round(0);
			return returnValue.toString(10);
		}

		toFiat(number, unit, multi) {
			let returnValue = new BigNumber(this.toEther(number, unit)).times(multi).round(5);
			return returnValue.toString(10);
		}

		toEther(number, unit) {
			let returnValue = new BigNumber(this.toWei(number, unit)).div(
				this.getValueOfUnit('ether')
			);
			return returnValue.toString(10);
		}

		toWei(number, unit) {
			let returnValue = new BigNumber(String(number)).times(this.getValueOfUnit(unit));
			return returnValue.toString(10);
		}

		unitToUnit(number, from, to) {
			let returnValue = new BigNumber(String(number))
				.times(this.getValueOfUnit(from))
				.div(this.getValueOfUnit(to));
			return returnValue.toString(10);
		}
	}

	return new EtherUnits();
}
EtherUnits.$inject = ['$rootScope', '$log', '$http'];
module.exports = EtherUnits;
