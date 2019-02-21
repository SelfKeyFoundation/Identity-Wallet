import React from 'react';

import { Provider } from 'react-redux';
import { Route, HashRouter } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { SelfkeyDarkTheme } from 'selfkey-ui';
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
import Loading from './home/loading';
import ConnectingToLedger from './wallet/unlock/ledger/connecting';

const App = ({ store, history }) => (
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
					</div>
				</HashRouter>
			</ConnectedRouter>
		</Provider>
	</SelfkeyDarkTheme>
);

export default App;
