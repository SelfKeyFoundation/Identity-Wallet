import React, { PureComponent } from 'react';
import { Logger } from 'common/logger';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter, push } from 'connected-react-router';
import { SelfkeyDarkTheme } from 'selfkey-ui';
import { appOperations } from 'common/app';
import { schedulerOperations } from 'common/scheduler';

import { GlobalError } from './global-error';
// Pages
import Home from './home';
import CreateWallet from './wallet/create';
import CreatePassword from './wallet/create/password';
import NoConnection from './no-connection';
import PasswordConfirmation from './wallet/create/password/confirmation-container';
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
import { SelfKeyIdCreateForm } from './selfkey-id/main/components/selfkey-id-create-form';
import AutoUpdate from './auto-update/auto-update-contatiner';
import AutoUpdateProgress from './auto-update/auto-update-progress-contatiner';
import ApproveSessionContainer from './wallet-connect/approve-session-container';
import SignMessageContainer from './wallet-connect/sign-message-container';

const log = new Logger('AppComponent');

class AppContainerComponent extends PureComponent {
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
			<ConnectedRouter history={this.props.history}>
				<Switch>
					<Route exact path="/" component={Loading} />
					<Route exact path="/home" component={Home} />
					<Route path="/no-connection" component={NoConnection} />
					<Route path="/createWallet" component={CreateWallet} />
					<Route path="/createPassword" component={CreatePassword} />
					<Route path="/createPasswordConfirmation" component={PasswordConfirmation} />
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
					<Route path="/selfkeyIdForm" component={SelfKeyIdCreateForm} />
					<Route path="/auto-update" component={AutoUpdate} />
					<Route path="/auto-update-progress" component={AutoUpdateProgress} />
					<Route
						path="/wallet-connect/approve-session"
						component={ApproveSessionContainer}
					/>
					<Route path="/wallet-connect/sign-message" component={SignMessageContainer} />
				</Switch>
			</ConnectedRouter>
		);
	}
}

const AppContainer = connect()(AppContainerComponent);

const App = ({ store, history }) => (
	<SelfkeyDarkTheme>
		<AppContainer history={history} />
	</SelfkeyDarkTheme>
);

export default App;
