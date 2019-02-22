/* eslint-env browser */ /* global staticPath */
import React from 'react';
import { render } from 'react-dom';

import store from './common/store';
import history from 'common/store/history';
import { shell } from 'electron';
import registerServiceWorker from './registerServiceWorker';
import { setGlobalContext, configureContext } from 'common/context';
import path from 'path';

import App from './app';

require('../../static/stylesheets/scss/main.scss');

const ctx = configureContext('renderer').cradle;
setGlobalContext(ctx);

const isDevelopment = process.env.NODE_ENV === 'development';
window.staticPath = isDevelopment ? '' : window.__dirname.replace(/app\.asar$/, 'static');

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

// open links externally by default
window.openExternal = (event, href) => {
	event && event.preventDefault();
	shell.openExternal(href);
};

window.store = store;

render(<App store={store} history={history} />, document.getElementById('app'));
registerServiceWorker();
