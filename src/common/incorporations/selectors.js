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
		return this.getTaxes(state).find(tax => tax.companyCode === companyCode);
	},
	getMainIncorporationByCompanyCode(state, companyCode) {
		return this.getMainIncorporations(state).find(inc => inc.companyCode === companyCode);
	},
	getMainIncorporationsWithTaxes(state) {
		return this.getMainIncorporations(state).map(inc => ({
			...inc,
			tax: this.getTaxByCompanyCode(state, inc.companyCode) || {}
		}));
	},
	getIncorporationsDetails(state, companyCode) {
		const inc = this.getMainIncorporationByCompanyCode(state, companyCode);
		inc.tax = this.getTaxByCompanyCode(state, companyCode);

		return inc;
	}
};

// export const getIncorporationsTree = state => {
// 	return state.incorporations;
// };

// const getTaxForCompanyCode = (taxArray, code) => {
// 	return taxArray.find(e => {
// 		return e.data.fields['Company code'] === code;
// 	});
// };

// const getProgramForCompanyCode = (corpArray, foundArray, trustArray, code) => {
// 	console.log(code, corpArray);
// 	let program = corpArray.find(e => {
// 		return e.data.fields['Company code'] === code;
// 	});

// 	if (!program) {
// 		program = foundArray.find(e => {
// 			return e.data.fields['Company code'] === code;
// 		});

// 		if (!program) {
// 			program = trustArray.find(e => {
// 				return e.data.fields['Company code'] === code;
// 			});
// 		}
// 	}
// 	console.log(program);

// 	return program;
// };

// const getTranslationForCompanyCode = (transArray, code) => {
// 	return transArray.find(e => {
// 		return e.data.fields['Company code'] === code;
// 	});
// };

// const getTaxFieldForCompanyCode = (taxArray, code, field) => {
// 	const tax = getTaxForCompanyCode(taxArray, code);
// 	return tax ? tax.data.fields[field] : false;
// };

export default incorporationsSelectors;
