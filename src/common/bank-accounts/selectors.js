import config from 'common/config';

const selectPrice = bank => {
	if (!bank.price && !bank.testPrice) return null;

	// Check for override ENV variables
	// if (config.incorporationsPriceOverride) return config.incorporationsPriceOverride;

	let price = bank.price;

	if (config.dev) {
		price = bank.testPrice;
	} else {
		if (bank.activeTestPrice) {
			price = bank.testPrice;
		}
	}
	return parseFloat(price.replace(/\$/, '').replace(/,/, ''));
};

const selectTemplate = bank => {
	if (!bank.templateId && !bank.testTemplateId) return null;

	let templateId = bank.templateId;
	/*
	if (config.dev) {
		templateId = bank.testTemplateId
	}
	*/
	return templateId;
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
			b.accountType = b.type ? b.type[0].toLowerCase() : null;
			return b;
		});
	},
	getBankByAccountCode(state, accountCode) {
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
		return details.find(c => c.accountCode === accountCode);
	}
};

export default bankAccountsSelectors;
