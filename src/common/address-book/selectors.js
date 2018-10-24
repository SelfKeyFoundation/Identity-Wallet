export const getAddresses = state => {
	return state.addressBook.entries;
};

export const getLabelError = state => {
	return state.addressBook.labelError;
};

export const getAddressError = state => {
	return state.addressBook.addressError;
};

export const getLabel = (state, id) => {
	const entries = state.addressBook.entries.filter(entry => {
		return entry.id === id;
	});
	return entries.length > 0 ? entries[0].label : '';
};
