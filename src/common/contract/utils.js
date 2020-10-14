import BN from 'bignumber.js';
export const validateContractAddress = address => /^0x[a-fA-F0-9]{40}$/.test(address);

export const validateAllowanceAmount = (amount, decimals) => {
	const max = new BN('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
	amount = new BN(toFullAmount(amount, decimals || 0));
	if (amount.isNaN()) return false;
	if (amount.gt(max)) return false;
	if (amount.lt(0)) return false;
	return true;
};

export const toFullAmount = (amount, decimals) => {
	return new BN(amount).times(new BN(10).pow(decimals)).toString();
};

export const fromFullAmount = (amount, decimals) => {
	return new BN(amount).div(new BN(10).pow(decimals)).toPrecision(decimals);
};
