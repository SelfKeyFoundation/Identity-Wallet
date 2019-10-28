export const addressShortener = (address, charsFromBeginning = 12, charsFromBack = 10) => {
	return `${address.substring(0, charsFromBeginning)}...${address.substring(
		address.length - charsFromBack,
		address.length
	)}`;
};
