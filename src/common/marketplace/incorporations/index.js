import { inventorySelectors } from '../inventory';
import config from 'common/config';

const selectPrice = item => {
	const { data: program } = item;
	// Check for override ENV variables
	if (config.incorporationsPriceOverride) return config.incorporationsPriceOverride;
	if (!program.walletPrice && !program.testPrice) return null;

	let price = `${program.walletPrice}`;
	if (config.dev || program.activeTestPrice) {
		price = `${program.testPrice}`;
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
	const { data: program } = item;
	if (!program.walletOptions) {
		return [];
	}
	const options = program.walletOptions;

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
			.selectInventoryForCategory(state, 'incorporations', null, entityType)
			.map(c => {
				c.price = selectPrice(c);
				c.templateId = selectTemplate(c);
				c.data.checkoutOptions = parseOptions(c);
				c.walletAddress = selectVendorWalletAddress(c);
				c.didAddress = selectVendorDidAddress(c);
				return c;
			}),
	selectIncorporationByFilter: (state, filter, entityType) =>
		incorporationsSelectors.selectIncorporations(state, entityType).find(filter)
};

export default incorporationsSelectors;
