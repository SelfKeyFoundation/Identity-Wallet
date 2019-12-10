import { inventorySelectors } from '../inventory';
import config from 'common/config';

const selectPrice = item => {
	const { data: bank } = item;
	// Check for override ENV variables
	if (config.bankAccountsPriceOverride) return config.bankAccountsPriceOverride;
	if (!bank.price && !bank.testPrice) return null;

	let price = `${bank.price}`;
	if (config.dev || bank.activeTestPrice) {
		price = `${bank.testPrice}`;
	}

	return parseFloat(price.replace(/\$/, '').replace(/,/, ''));
};

const selectTemplate = item => {
	const { data: bank } = item;
	// Check for override ENV variables
	if (config.bankAccountsTemplateOverride) return config.bankAccountsTemplateOverride;
	if (!bank.templateId && !bank.testTemplateId) return null;

	const templateId = config.dev ? bank.testTemplateId : bank.templateId;
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

export const bankingSelectors = {
	selectBanks: (state, entityType) =>
		inventorySelectors.selectInventoryForCategory(state, 'banking', null, entityType).map(b => {
			b.price = selectPrice(b);
			b.templateId = selectTemplate(b);
			b.data.checkoutOptions = parseOptions(b);
			b.accountType = b.data.type ? b.data.type.toLowerCase() : null;
			b.walletAddress = selectVendorWalletAddress(b);
			b.didAddress = selectVendorDidAddress(b);
			return b;
		}),
	selectBankTypeByFilter: (state, filter, entityType) =>
		bankingSelectors.selectBanks(state, entityType).find(filter),
	selectBankJurisdictionByAccountCode: (state, accountCode, entityType) =>
		bankingSelectors
			.selectBanks(state, entityType)
			.find(b => b.data.accountCode === accountCode)
};

export default bankingSelectors;
