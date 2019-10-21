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
	getIncorporations(state) {
		return Object.keys(state.marketplaces.inventoryById).filter(
			i => state.marketplaces.inventoryById[i].category === 'incorporations'
		);
	},
	getLoading(state) {
		return this.getIncorporations(state).loading;
	},
	getError(state) {
		return this.getIncorporations(state).error;
	},
	getMainIncorporations(state) {
		const inventoryIds = this.getIncorporations(state);
		const parsedData = inventoryIds.map(id => {
			const i = state.marketplaces.inventoryById[id];
			i.price = selectPrice(i);
			i.templateId = selectTemplate(i);
			i.data.checkoutOptions = parseOptions(i);
			i.walletAddress = selectVendorWalletAddress(i);
			i.didAddress = selectVendorDidAddress(i);
			return i;
		});
		return parsedData;
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
		return this.getMainIncorporations(state).find(c => c.data.companyCode === companyCode);
	},
	getCorporations(state) {
		const tree = this.getIncorporations(state);
		return tree.corporations.map(id => tree.corporationsById[id]);
	},
	getCorporationsByCompanyCode(state, companyCode) {
		return this.getCorporations(state).find(c => c.data.companyCode === companyCode);
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
		return this.getMainIncorporations(state);
		/*
		return this.getMainIncorporations(state).map(inc => ({
			...inc,
			tax: this.getTaxByCompanyCode(state, inc['Company code']) || {}
		}));
		*/
	},
	getIncorporationsDetails(state, companyCode) {
		const inc = this.getMainIncorporationByCompanyCode(state, companyCode);
		// inc.tax = this.getTaxByCompanyCode(state, companyCode);
		// inc.translation = this.getTranslationByCompanyCode(state, companyCode);
		// inc.details = this.getDetailsForCompanyCode(state, companyCode);
		return inc;
	},
	getTaxTreaties(state, countryCode) {
		const root = state.marketplace.taxTreaties;
		const ids = Object.keys(root.byId).filter(i => root.byId[i].countryCode === countryCode);
		return ids.map(id => root.byId[id]);
		/*
		if (!countryCode) {
			return false;
		}
		const tree = this.getIncorporations(state);

		// Dynamic property, created after API call, might not exist at runtime
		if (!tree[`treaties-${countryCode}`]) {
			return false;
		}

		return tree[`treaties-${countryCode}`].map(id => tree[`treatiesById-${countryCode}`][id]);
		*/
	},
	getCountry(state, countryCode) {
		const root = state.marketplace.countries;
		// TODO: move to specific selector file
		const id = Object.keys(root.byId).find(i => root.byId[i].code === countryCode);
		return root.byId[id];
	}
};

export default incorporationsSelectors;
