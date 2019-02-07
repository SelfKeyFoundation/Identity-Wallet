export const formatDataUrl = (mime, buffer) => {
	if (mime instanceof Buffer) {
		buffer = mime;
		mime = null;
	}
	mime = mime || '';
	if (!buffer) return null;
	return `data:${mime};base64,${buffer.toString('base64')}`;
};

export const bufferFromDataUrl = dataUrl => {
	if (!dataUrl) return null;
	let parts = (dataUrl || '').split(';base64,');
	if (parts.length !== 2) return Buffer.from(dataUrl, 'base64');
	return Buffer.from(parts[1], 'base64');
};
