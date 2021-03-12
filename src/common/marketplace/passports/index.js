import { inventorySelectors } from '../inventory';
import config from 'common/config';

const selectPrice = item => {
	const { data: program } = item;
	// Check for override ENV variables
	if (config.passportsPriceOverride) return config.passportsPriceOverride;
	if (!program.price && !program.testPrice) return null;

	let price = `${program.price}`;
	if (config.dev || program.activeTestPrice) {
		price = `${program.testPrice}`;
	}

	return parseFloat(price.replace(/\$/, '').replace(/,/, ''));
};

const selectTemplate = item => {
	const { data: program } = item;
	// Check for override ENV variables
	if (config.passportsTemplateOverride) return config.passportsTemplateOverride;
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
/*
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
*/
export const passportsSelectors = {
	selectPassports: (state, entityType) =>
		inventorySelectors
			.selectInventoryForCategory(state, 'passports', 'active', entityType)
			.map(program => {
				program.price = selectPrice(program);
				program.templateId = selectTemplate(program);
				program.walletAddress = selectVendorWalletAddress(program);
				program.didAddress = selectVendorDidAddress(program);
				/*
				b.data.checkoutOptions = parseOptions(b);
				b.accountType = b.data.type ? b.data.type.toLowerCase() : null;
				// TODO: in the future should be provided by the API
				b.whatYouGet =
					'Bank Account opening requirements are subject to change at the discretion of the bank. There might be additional fees charged by the bank itself. Bank account opening is not guaranteed and is subject to the bank policies and compliance department. There might be restrictions on UBO nationalities, business activities and/or jurisdictions. A refund is guaranteed if the account is not successfully opened, but a 15% administrative fee applies.';
				*/
				return program;
			}),
	selectPassportsByFilter: (state, filter, entityType) =>
		passportsSelectors.selectPassports(state, entityType).find(filter)
};

export default passportsSelectors;
