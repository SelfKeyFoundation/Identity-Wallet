import { BigNumber } from 'bignumber.js';

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

class EthUnits {
	static getValueOfUnit(unit) {
		unit = unit ? unit.toLowerCase() : 'ether';
		let unitValue = UNIT_MAP[unit];
		return unitValue === undefined ? null : new BigNumber(unitValue, 10);
	}

	static fiatToWei(number, pricePerEther) {
		let returnValue = new BigNumber(String(number))
			.div(pricePerEther)
			.times(EthUnits.getValueOfUnit('ether'))
			.round(0);
		return returnValue.toString(10);
	}

	static toWei(number, unit) {
		let returnValue = new BigNumber(String(number)).times(EthUnits.getValueOfUnit(unit));
		return returnValue.toString(10);
	}

	static toEther(number, unit) {
		let returnValue = new BigNumber(EthUnits.toWei(number, unit)).div(
			EthUnits.getValueOfUnit('ether')
		);
		return returnValue.toString(10);
	}

	static toFiat(number, unit, multi) {
		let returnValue = new BigNumber(EthUnits.toEther(number, unit)).times(multi).round(5);
		return returnValue.toString(10);
	}

	static unitToUnit(number, from, to) {
		var returnValue = new BigNumber(String(number))
			.times(EthUnits.getValueOfUnit(from))
			.div(EthUnits.getValueOfUnit(to));
		return returnValue.toString(10);
	}
}

export default EthUnits;
