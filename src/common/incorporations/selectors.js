import config from 'common/config';

const selectPrice = program => {
	// Check for override ENV variables
	if (config.incorporationsPriceOverride) return config.incorporationsPriceOverride;
	if (!program['Wallet Price'] && !program.test_price) return null;

	let price = `${program['Wallet Price']}`;
	if (config.dev || program.active_test_price) {
		price = `${program.test_price}`;
	}

	return parseFloat(price.replace(/\$/, '').replace(/,/, ''));
};

const selectTemplate = program => {
	// Check for override ENV variables
	if (config.incorporationsTemplateOverride) return config.incorporationsTemplateOverride;
	if (!program.template_id && !program.test_template_id) return null;

	const templateId = config.dev ? program.test_template_id : program.template_id;
	return templateId;
};

const parseOptions = program => {
	if (!program.wallet_options) {
		return [];
	}
	const options = program.wallet_options;

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
		const data = tree.incorporations.map(incId => tree.incorporationsById[incId]);
		return data.map(i => {
			i.price = selectPrice(i);
			i.templateId = selectTemplate(i);
			i.checkoutOptions = parseOptions(i);
			return i;
		});
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
