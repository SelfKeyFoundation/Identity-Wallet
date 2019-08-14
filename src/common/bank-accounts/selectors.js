import config from 'common/config';

const selectPrice = bank => {
	// Check for override ENV variables
	if (config.bankAccountsPriceOverride) return config.bankAccountsPriceOverride;
	if (!bank.price && !bank.testPrice) return null;

	let price = `${bank.price}`;
	if (config.dev || bank.activeTestPrice) {
		price = `${bank.testPrice}`;
	}

	return parseFloat(price.replace(/\$/, '').replace(/,/, ''));
};

const selectTemplate = bank => {
	// Check for override ENV variables
	if (config.bankAccountsTemplateOverride) return config.bankAccountsTemplateOverride;
	if (!bank.templateId && !bank.testTemplateId) return null;

	const templateId = config.dev ? bank.testTemplateId : bank.templateId;
	return templateId;
};

const selectVendorWalletAddress = program => {
	if (config.dev) {
		return program['testWalletAddress']
			? program['testWalletAddress']
			: config.testWalletAddress;
	} else {
		return program['walletAddress'];
	}
};

const selectVendorDidAddress = program => {
	if (config.dev) {
		return program['testDidAddress'] ? program['testDidAddress'] : config.testDidAddress;
	} else {
		return program['didAddress'];
	}
};

const parseOptions = bank => {
	if (!bank.priceOptions) {
		return [];
	}
	const options = bank.priceOptions;

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

export const bankAccountsSelectors = {
	getBankAccounts(state) {
		return state.bankAccounts;
	},
	getLoading(state) {
		return this.getBankAccounts(state).loading;
	},
	getError(state) {
		return this.getBankAccounts(state).error;
	},
	getMainBankAccounts(state) {
		const tree = this.getBankAccounts(state);
		const data = tree.main.map(bId => tree.mainById[bId]);
		return data.map(b => {
			b.price = selectPrice(b);
			b.templateId = selectTemplate(b);
			b.checkoutOptions = parseOptions(b);
			b.accountType = b.type ? b.type[0].toLowerCase() : null;
			b.walletAddress = selectVendorWalletAddress(b);
			b.didAddress = selectVendorDidAddress(b);
			return b;
		});
	},
	getTypeByAccountCode(state, accountCode) {
		const banks = this.getMainBankAccounts(state);
		return banks.find(b => b.accountCode === accountCode);
	},
	getJurisdictions(state) {
		const tree = this.getBankAccounts(state);
		return tree.jurisdictions.map(id => tree.jurisdictionsById[id]);
	},
	getJurisdictionsByCountryCode(state, countryCode) {
		return this.getJurisdictions(state).find(c => c.countryCode === countryCode);
	},
	getDetails(state) {
		const tree = this.getBankAccounts(state);
		return tree.details.map(id => tree.detailsById[id]);
	},
	getDetailsByAccountCode(state, accountCode) {
		const details = this.getDetails(state);
		return details.filter(c => c.accountCode === accountCode);
	}
};

export default bankAccountsSelectors;
