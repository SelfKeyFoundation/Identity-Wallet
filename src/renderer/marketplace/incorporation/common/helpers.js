import config from 'common/config';

const getIncorporationPrice = program => {
	// Check for override ENV variables
	if (config.incorporationsPriceOverride) return config.incorporationsPriceOverride;

	let price = program['Wallet Price'];

	if (config.dev) {
		price = program['test_price'];
	} else {
		if (program['active_test_price']) {
			price = program['test_price'];
		}
	}

	return price ? parseFloat(price.replace(/\$/, '').replace(/,/, '')) : false;
};

const getTemplateID = program => {
	// Check for override ENV variables
	if (config.incorporationsTemplateOverride) return config.incorporationsTemplateOverride;

	const templateID = config.dev ? program['test_template_id'] : program['template_id'];
	return templateID;
};

export { getIncorporationPrice, getTemplateID };
