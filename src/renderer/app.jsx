import React, { Component } from 'react';
import { Logger } from 'common/logger';
import { Provider, connect } from 'react-redux';
import { Route, HashRouter } from 'react-router-dom';
import { ConnectedRouter, push } from 'connected-react-router';
import ReactPiwik from 'react-piwik';
import { SelfkeyDarkTheme } from 'selfkey-ui';
import { appOperations } from 'common/app';
import { schedulerOperations } from 'common/scheduler';
import config from 'common/config';

import { GlobalError } from './global-error';
// Pages
import Home from './home';
import CreateWallet from './wallet/create';
import CreatePassword from './wallet/create/password';
import CloseConfirmation from './close-confirmation';
import NoConnection from './no-connection';
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
import AutoUpdate from './auto-update/auto-update-contatiner';
import AutoUpdateProgress from './auto-update/auto-update-progress-contatiner';

const log = new Logger('AppComponent');

const piwik = new ReactPiwik({
	url: 'https://analytics.selfkey.org',
	siteId: config.matomoSite || 1,
	trackErrors: true
});
ReactPiwik.push(['requireConsent']);
ReactPiwik.push(['trackPageView']);
ReactPiwik.push(['enableHeartBeatTimer']);
ReactPiwik.push(['trackAllContentImpressions']);

class AppContainerComponent extends Component {
	state = { hasError: false };
	handleRefresh = async () => {
		await this.props.dispatch(push('/'));
		this.setState({ hasError: false });
	};
	static getDerivedStateFromError() {
		return { hasError: true };
	}
	componentDidCatch(error, info) {
		// You can also log the error to an error reporting service
		log.error('Global react error occured %s, %2j', error, info);
	}
	componentDidMount() {
		this.props.dispatch(appOperations.loadWalletsOperation());
		this.props.dispatch(schedulerOperations.startSchedulerOperation());
	}
	componentWillUnmount() {
		this.props.dispatch(schedulerOperations.stopSchedulerOperation());
	}
	render() {
		const { hasError } = this.state;
		if (hasError) {
			return <GlobalError onRefresh={this.handleRefresh} />;
		}
		return (
			<ConnectedRouter history={piwik.connectToHistory(this.props.history.getHistory())}>
				<HashRouter>
					<div>
						<Route exact path="/" component={Loading} />
						<Route exact path="/home" component={Home} />
						<Route path="/closeConfirmation" component={CloseConfirmation} />
						<Route path="/no-connection" component={NoConnection} />
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
						<Route path="/auto-update" component={AutoUpdate} />
						<Route path="/auto-update-progress" component={AutoUpdateProgress} />
					</div>
				</HashRouter>
			</ConnectedRouter>
		);
	}
}

const AppContainer = connect()(AppContainerComponent);

const App = ({ store, history }) => (
	<SelfkeyDarkTheme>
		<Provider store={store}>
			<AppContainer history={history} />
		</Provider>
	</SelfkeyDarkTheme>
);

export default App;
