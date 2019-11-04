/* eslint-env browser */ /* global staticPath */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureContext, setGlobalContext, getGlobalContext } from 'common/context';
import path from 'path';
import { shell } from 'electron';

import App from './app';

require('../../static/stylesheets/scss/main.scss');
require('../../node_modules/selfkey-ui/build/lib/assets/icon-calendar.svg');

const isDevelopment = process.env.NODE_ENV === 'development';

const initCtx = (options = {}) => {
	const ctx = configureContext('renderer', options).cradle;
	setGlobalContext(ctx);
	return ctx;
};

const initWindow = () => {
	window.staticPath = isDevelopment ? '' : window.__dirname.replace(/app\.asar$/, 'static');
	// open links externally by default
	window.openExternal = (event, href) => {
		event && event.preventDefault();
		shell.openExternal(href);
	};
	window.store = getGlobalContext().store;
};

const initDocument = () => {
	const title = document.createElement('title');
	title.innerHTML = 'SelfKey Identity Wallet';
	document.head.appendChild(title);

	const icon32 = document.createElement('link');
	icon32.href = path.join(staticPath, 'assets/images/favicons/kyc-32x32.png');
	icon32.rel = 'icon';
	icon32.sizes = '32x32';
	document.head.appendChild(icon32);

	const icon192 = document.createElement('link');
	icon192.href = path.join(staticPath, 'assets/images/favicons/kyc-192x192.png');
	icon192.rel = 'icon';
	icon192.sizes = '192x192';
	document.head.appendChild(icon192);

	const iconApple = document.createElement('link');
	iconApple.href = path.join(staticPath, 'assets/images/favicons/kyc-180x180.png');
	iconApple.rel = 'apple-touch-icon-precomposed';
	document.head.appendChild(iconApple);
};

const initReact = App => {
	const ctx = getGlobalContext();
	render(
		<Provider store={ctx.store}>
			<App history={ctx.history} />
		</Provider>,
		document.getElementById('app')
	);
};

const initHotReload = () => {
	const store = getGlobalContext().store;
	module.hot.accept('./app.jsx', () => {
		const NextRootContainer = require('./app').default;
		initReact(NextRootContainer);
	});

	module.hot.accept('../common/context', () => {
		initCtx('renderer', { store });
		initReact(App);
	});
};

const main = () => {
	const ctx = initCtx();
	ctx.history.create();
	initWindow();
	initDocument();
	initReact(App);
	if (module.hot) {
		initHotReload();
	}
};

main();
