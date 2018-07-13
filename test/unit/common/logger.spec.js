const { expect } = require('chai');
const { Logger } = require('../../../src/common/logger');
const log = require('electron');
describe('Logger', () => {
	it('getRawLogger', () => {
		expect(Logger.getRawLogger()).to.eq(log);
	});
});
