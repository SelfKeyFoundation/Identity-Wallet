import config from 'common/config';

const selectPrice = item => {
	const { data: notary } = item;
	// Check for override ENV variables
	if (config.notariesPriceOverride) return config.notariesPriceOverride;
	if (!notary.price && !notary.testPrice) return null;

	let price = `${notary.price}`;
	if (config.dev || notary.activeTestPrice) {
		price = `${notary.testPrice}`;
	}

	return parseFloat(price.replace(/\$/, '').replace(/,/, ''));
};

const selectTemplate = item => {
	const { data: notary } = item;
	// Check for override ENV variables
	if (config.notariesTemplateOverride) return config.notariesTemplateOverride;
	if (!notary.templateId && !notary.testTemplateId) return null;

	const templateId = config.dev ? notary.testTemplateId : notary.templateId;
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

export const notariesSelectors = {
	selectNotaries: state =>
		inventorySelectors.selectInventoryForCategory(state, 'notaries').map(b => {
			b.price = selectPrice(b);
			b.templateId = selectTemplate(b);
			b.data.checkoutOptions = parseOptions(b);
			b.accountType = b.data.type ? b.data.type.toLowerCase() : null;
			b.walletAddress = selectVendorWalletAddress(b);
			b.didAddress = selectVendorDidAddress(b);
			return b;
		}),
	selectNotaryTypeByFilter: (state, filter) => notarySelectors.selectNotaries(state).find(filter),
	selectNotaryJurisdictionByAccountCode: (state, accountCode) =>
		notarySelectors.selectNotaries(state).find(n => n.data.accountCode === accountCode)
};

export default notariesSelectors;
