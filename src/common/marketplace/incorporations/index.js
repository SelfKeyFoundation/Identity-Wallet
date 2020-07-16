import { inventorySelectors } from '../inventory';
import config from 'common/config';

const selectPrice = item => {
	const { data } = item;
	// Check for override ENV variables
	if (config.incorporationsPriceOverride) return config.incorporationsPriceOverride;
	if (!data.walletPrice && !data.testPrice) {
		return item.price;
	}

	let price = `${data.walletPrice}`;
	if (config.dev || data.activeTestPrice) {
		price = `${data.testPrice}`;
	}

	return parseFloat(price.replace(/\$/, '').replace(/,/, ''));
};

const selectTemplate = item => {
	const { data: program } = item;
	// Check for override ENV variables
	if (config.incorporationsTemplateOverride) return config.incorporationsTemplateOverride;
	if (!program.templateId && !program.testTemplateId) return null;

	const templateId = config.dev ? program.testTemplateId : program.templateId;
	return templateId;
};

const selectVendorWalletAddress = item => {
	const { data: program } = item;
	if (config.dev) {
		return program.testWalletAddress ? program.testWalletAddress : config.testWalletAddress;
	} else {
		return program.walletAddress;
	}
};

const selectVendorDidAddress = item => {
	const { data: program } = item;
	if (config.dev) {
		return program.testDidAddress ? program.testDidAddress : config.testDidAddress;
	} else {
		return program.didAddress;
	}
};

const parseOptions = item => {
	const { data } = item;
	if (!data.walletOptions && !data.priceOptions) {
		return [];
	}
	const options = data.walletOptions ? data.walletOptions : data.priceOptions;

	const strArray = options.split('-');

	const optionsArray = strArray.map((text, idx) => {
		if (!text) return false;
		let price = text.match(/\(.*\)/);
		let notes = text.match(/\[.*\]/);
		const id = `options-${idx}`;
		price = price ? price[0].replace('(', '').replace(')', '') : '';
		price = price ? parseInt(price) : '';
		notes = notes ? notes[0].replace('[', '').replace(']', '') : '';
		const description = text
			.replace(/\(.*\)/, '')
			.replace(/\[.*\]/, '')
			.trim();

		return { price, notes, description, id };
	});

	return optionsArray.filter(el => el !== false);
};

export const incorporationsSelectors = {
	selectIncorporations: (state, entityType) =>
		inventorySelectors
			.selectInventoryForCategory(state, 'incorporations', 'active', entityType)
			.map(c => {
				c.price = selectPrice(c);
				c.templateId = selectTemplate(c);
				c.data.checkoutOptions = parseOptions(c);
				c.walletAddress = selectVendorWalletAddress(c);
				c.didAddress = selectVendorDidAddress(c);
				// TODO: in the future should be provided by the API
				c.whatYouGet =
					'All our incorporation services include a yearly consulting session, a dedicated account manager and access to our global network of trusted business services, including introductions to accountants, financial, tax and legal advisors at no cost.';
				return c;
			}),
	selectIncorporationByFilter: (state, filter, entityType) =>
		incorporationsSelectors.selectIncorporations(state, entityType).find(filter)
};

export default incorporationsSelectors;
