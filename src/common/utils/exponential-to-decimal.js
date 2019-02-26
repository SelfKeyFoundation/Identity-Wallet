/**
 * Checks if number is in exponential format (eg: 1e-8 for 0.00000001).
 * If it does not, original number is returned.
 * If it does it converts it to string representation of that number
 * which forces it to format 0.00000001
 */
export function convertExponentialToDecimal(exponentialNumber) {
	// sanity check - is it exponential number
	const str = exponentialNumber.toString();
	if (str.indexOf('e') !== -1) {
		const exponent = parseInt(str.split('-')[1], 10); // Unfortunately I can not return 1e-8 as 0.00000001, because even if I call parseFloat() on it, // it will still return the exponential representation // So I have to use .toFixed()
		const result = exponentialNumber.toFixed(exponent);
		return result;
	} else {
		return exponentialNumber;
	}
}
