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
	const entry = state.addressBook.entries.filter(entry => {
		return entry.id === id;
	});
	return entry[0].label;
};
