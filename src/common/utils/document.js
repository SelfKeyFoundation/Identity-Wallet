export const formatDataUrl = (mime, buffer) => {
	return `data:${mime};base64,${buffer.toString('base64')}`;
};
