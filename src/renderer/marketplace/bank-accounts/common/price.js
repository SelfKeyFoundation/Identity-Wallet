import config from 'common/config';

const getBankPrice = bank => {
	if (!bank['Price'] && !bank['Test_Price']) return null;

	// Check for override ENV variables
	// if (config.incorporationsPriceOverride) return config.incorporationsPriceOverride;
	let price = bank['Price'];

	if (config.dev) {
		price = bank['Test_Price'];
	} else {
		if (bank['Active_Test_Price']) {
			price = bank['Test_Price'];
		}
	}
	return parseFloat(price.replace(/\$/, '').replace(/,/, ''));
};

export { getBankPrice };
