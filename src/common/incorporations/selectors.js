export const incorporationsSelectors = {
	getIncorporations(state) {
		return state.incorporations;
	},
	getLoading(state) {
		return this.getIncorporations(state).loading;
	},
	getError(state) {
		return this.getIncorporations(state).error;
	},
	getMainIncorporations(state) {
		const tree = this.getIncorporations(state);
		return tree.incorporations.map(incId => tree.incorporationsById[incId]);
	},
	getTaxes(state) {
		const tree = this.getIncorporations(state);
		return tree.taxes.map(taxId => tree.taxesById[taxId]);
	},
	getTaxByCompanyCode(state, companyCode) {
		return this.getTaxes(state).find(tax => tax['Company code'] === companyCode);
	},
	getTranslation(state) {
		const tree = this.getIncorporations(state);
		return tree.translation.map(id => tree.translationById[id]);
	},
	getTranslationByCompanyCode(state, companyCode) {
		return this.getTranslation(state).find(t => t['Company code'] === companyCode);
	},
	getMainIncorporationByCompanyCode(state, companyCode) {
		return this.getMainIncorporations(state).find(inc => inc['Company code'] === companyCode);
	},
	getCorporations(state) {
		const tree = this.getIncorporations(state);
		return tree.corporations.map(id => tree.corporationsById[id]);
	},
	getCorporationsByCompanyCode(state, companyCode) {
		return this.getCorporations(state).find(c => c['Company code'] === companyCode);
	},
	getLLCs(state) {
		const tree = this.getIncorporations(state);
		return tree.llcs.map(id => tree.llcsById[id]);
	},
	getLLCsByCompanyCode(state, companyCode) {
		return this.getLLCs(state).find(c => c['Company code'] === companyCode);
	},
	getFoundations(state) {
		const tree = this.getIncorporations(state);
		return tree.foundations.map(id => tree.foundationsById[id]);
	},
	getFoundationsByCompanyCode(state, companyCode) {
		return this.getFoundations(state).find(c => c['Company code'] === companyCode);
	},
	getTrusts(state) {
		const tree = this.getIncorporations(state);
		return tree.trusts.map(id => tree.trustsById[id]);
	},
	getTrustsByCompanyCode(state, companyCode) {
		return this.getTrusts(state).find(c => c['Company code'] === companyCode);
	},
	getDetailsForCompanyCode(state, companyCode) {
		let data = this.getCorporationsByCompanyCode(state, companyCode);
		if (!data) {
			data = this.getLLCsByCompanyCode(state, companyCode);
		}
		if (!data) {
			data = this.getFoundationsByCompanyCode(state, companyCode);
		}
		if (!data) {
			data = this.getTrustsByCompanyCode(state, companyCode);
		}
		return data;
	},
	getMainIncorporationsWithTaxes(state) {
		return this.getMainIncorporations(state).map(inc => ({
			...inc,
			tax: this.getTaxByCompanyCode(state, inc['Company code']) || {}
		}));
	},
	getIncorporationsDetails(state, companyCode) {
		const inc = this.getMainIncorporationByCompanyCode(state, companyCode);
		inc.tax = this.getTaxByCompanyCode(state, companyCode);
		inc.translation = this.getTranslationByCompanyCode(state, companyCode);
		inc.details = this.getDetailsForCompanyCode(state, companyCode);

		return inc;
	},
	getTaxTreaties(state, countryCode) {
		if (!countryCode) {
			return false;
		}
		const tree = this.getIncorporations(state);

		// Dynamic property, created after API call, might not exist at runtime
		if (!tree[`treaties-${countryCode}`]) {
			return false;
		}

		return tree[`treaties-${countryCode}`].map(id => tree[`treatiesById-${countryCode}`][id]);
	},
	getCountry(state, countryCode) {
		if (!countryCode) {
			return false;
		}
		const tree = this.getIncorporations(state);

		// Dynamic property, created after API call, might not exist at runtime
		if (!tree[`country-${countryCode}`]) {
			return false;
		}

		return tree[`countryById-${countryCode}`][countryCode];
	}
};

export default incorporationsSelectors;
