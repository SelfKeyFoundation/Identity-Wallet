const getTaxForCompanyCode = (taxArray, code) => {
	return taxArray.find(e => {
		return e.data.fields['Company code'] === code;
	});
};

const getTaxFieldForCompanyCode = (taxArray, code, field) => {
	const tax = getTaxForCompanyCode(taxArray, code);
	return tax ? tax.data.fields[field] : false;
};

export { getTaxForCompanyCode, getTaxFieldForCompanyCode };
