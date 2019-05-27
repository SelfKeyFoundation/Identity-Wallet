import config from 'common/config';

const selectPrice = bank => {
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
			b.Price = selectPrice(b);
			return b;
		});
	},
	getBankByAccountCode(state, accountCode) {
		const banks = this.getMainBankAccounts(state);
		// TODO: replace with Account Code when schema is changed
		return banks.find(b => b['Bank Code'] === accountCode);
	},
	getJurisdictions(state) {
		const tree = this.getBankAccounts(state);
		return tree.jurisdictions.map(id => tree.jurisdictionsById[id]);
	},
	getJurisdictionsByCountryCode(state, countryCode) {
		return this.getBankAccounts(state).find(c => c['Country Code'] === countryCode);
	},
	getDetails(state) {
		const tree = this.getBankAccounts(state);
		return tree.details.map(id => tree.detailsById[id]);
	},
	getDetailsByAccountCode(state, accountCode) {
		// TODO: replace with Account Code when schema is changed
		const details = this.getDetails(state);
		console.log(details);
		return details.find(c => c['Account Code'] === accountCode);
	}
};

export default bankAccountsSelectors;
