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
		return tree.main.map(incId => tree.mainById[incId]);
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
		return this.getBankAccounts(state).find(c => c['Account Code'] === accountCode);
	}
};

export default bankAccountsSelectors;
