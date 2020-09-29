const { validateContractAddress, validateAllowanceAmount } = require('./utils');

describe('contract utils', () => {
	describe('validateContractAddress', () => {
		const t = (address, isValid) =>
			it(`${address} should be ${isValid ? 'valid' : 'invalid'}`, () => {
				expect(validateContractAddress(address)).toBe(isValid);
			});
		t('0x4cc19356f2d37338b9802aa8e8fc58b0373296e7', true);
	});
	describe('validateAllowanceAmount', () => {
		const t = (name, amount, decimals, isValid) =>
			it(name, () => {
				expect(validateAllowanceAmount(amount, decimals)).toBe(isValid);
			});
		t('10 is valid', 10, null, true);
		t('-1 is invalid', -1, null, false);
		t('10 with 18 decimals is valid', 10, 18, true);
	});
});
