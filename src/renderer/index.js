/* eslint-env browser */ /* global staticPath */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './common/store';
import history from 'common/store/history';
import { shell } from 'electron';

import { Route, HashRouter } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { SelfkeyDarkTheme } from 'selfkey-ui';
import registerServiceWorker from './registerServiceWorker';

import { setGlobalContext, configureContext } from 'common/context';

// Pages
import Home from './home';
import CreateWallet from './wallet/create';
import CreatePassword from './wallet/create/password';
import CloseConfirmation from './close-confirmation';
import PasswordConfirmation from './wallet/create/password/confirmation';
import BackupAddress from './wallet/create/backup-address';
import BackupPK from './wallet/create/backup-pk';
import Main from './wallet/main';
import Unlock from './wallet/unlock';
import EnterPin from './wallet/unlock/trezor/enter-pin';
import EnterPassphrase from './wallet/unlock/trezor/enter-passphrase';
import SelectAddress from './wallet/unlock/select-address';
import ConnectingToTrezor from './wallet/unlock/trezor/connecting';
import Terms from './settings/terms';
import TermsWarning from './settings/terms-warning';
import Loading from './home/loading';
import ConnectingToLedger from './wallet/unlock/ledger/connecting';
import { SelfKeyIdCreate } from './selfkey-id/main/components/selfkey-id-create';
import { SelfKeyIdCreateAbout } from './selfkey-id/main/components/selfkey-id-create-about';
import { SelfKeyIdCreateDisclaimer } from './selfkey-id/main/components/selfkey-id-create-disclaimer';
import { SelfKeyIdCreateForm } from './selfkey-id/main/components/selfkey-id-create-form';

import path from 'path';

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
render(
	<SelfkeyDarkTheme>
		<Provider store={store}>
			<ConnectedRouter history={history.getHistory()}>
				<HashRouter>
					<div style={{ backgroundColor: '#262F39' }}>
						<Route exact path="/" component={Loading} />
						<Route exact path="/home" component={Home} />
						<Route path="/closeConfirmation" component={CloseConfirmation} />
						<Route path="/createWallet" component={CreateWallet} />
						<Route path="/createPassword" component={CreatePassword} />
						<Route
							path="/createPasswordConfirmation"
							component={PasswordConfirmation}
						/>
						<Route path="/backupAddress" component={BackupAddress} />
						<Route path="/backupPrivateKey" component={BackupPK} />
						<Route path="/main" component={Main} />
						<Route path="/unlockWallet" component={Unlock} />
						<Route path="/enterTrezorPin" component={EnterPin} />
						<Route path="/enterTrezorPassphrase" component={EnterPassphrase} />
						<Route path="/selectAddress" component={SelectAddress} />
						<Route path="/connectingToLedger" component={ConnectingToLedger} />
						<Route path="/connectingToTrezor" component={ConnectingToTrezor} />
						<Route path="/terms" component={Terms} />
						<Route path="/termsWarning" component={TermsWarning} />
						<Route path="/selfkeyIdCreateAbout" component={SelfKeyIdCreateAbout} />
						<Route
							path="/selfkeyIdCreateDisclaimer"
							component={SelfKeyIdCreateDisclaimer}
						/>
						<Route path="/selfKeyIdCreate" component={SelfKeyIdCreate} />
						<Route path="/selfkeyIdForm" component={SelfKeyIdCreateForm} />
					</div>
				</HashRouter>
			</ConnectedRouter>
		</Provider>
	</SelfkeyDarkTheme>,
	document.getElementById('app')
);

registerServiceWorker();
