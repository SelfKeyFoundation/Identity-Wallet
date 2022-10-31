import path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';

if (window) {
	window.staticPath = isDevelopment ? '' : window.__dirname.replace(/app\.asar$/, 'static');
}

export function resolveAsset(filePath) {
	return window && path.join(window.staticPath, filePath);
}
