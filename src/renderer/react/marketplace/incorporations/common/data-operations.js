const getTaxForCompanyCode = (taxArray, code) => {
	return taxArray.find(e => {
		return e.data.fields['Company code'] === code;
	});
};

const getProgramForCompanyCode = (corpArray, foundArray, trustArray, code) => {
	console.log(code, corpArray);
	let program = corpArray.find(e => {
		return e.data.fields['Company code'] === code;
	});

	if (!program) {
		program = foundArray.find(e => {
			return e.data.fields['Company code'] === code;
		});

		if (!program) {
			program = trustArray.find(e => {
				return e.data.fields['Company code'] === code;
			});
		}
	}
	console.log(program);

	return program;
};

const getTranslationForCompanyCode = (transArray, code) => {
	return transArray.find(e => {
		return e.data.fields['Company code'] === code;
	});
};

const getTaxFieldForCompanyCode = (taxArray, code, field) => {
	const tax = getTaxForCompanyCode(taxArray, code);
	return tax ? tax.data.fields[field] : false;
};

export {
	getTaxForCompanyCode,
	getTaxFieldForCompanyCode,
	getProgramForCompanyCode,
	getTranslationForCompanyCode
};
