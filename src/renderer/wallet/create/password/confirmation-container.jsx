import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import { handlePassword } from './password-util';
import { createWalletSelectors, createWalletOperations } from 'common/create-wallet';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { appSelectors, appOperations } from 'common/app';

import { getGlobalContext } from 'common/context';
import PasswordConfirmation from './confirmation-component';
import { featureIsEnabled } from 'common/feature-flags';

const goBackCreatePassword = React.forwardRef((props, ref) => (
	<Link to="/createPassword" {...props} ref={ref} />
));

class PasswordConfirmationContainer extends PureComponent {
	state = {
		password: '',
		passwordScore: 0,
		strength: '',
		error: ''
	};

	handlePasswordChange = e => {
		e && e.preventDefault();
		this.setState(handlePassword(e, this.state));
	};

	handleNext = async e => {
		e && e.preventDefault();
		if (this.props.firstPassword === this.state.password) {
			if (featureIsEnabled('hdWallet')) {
				if (this.props.app.selectedPrivateKey) {
					this.props.dispatch(
						appOperations.unlockWalletWithPrivateKeyOperation(
							this.props.app.selectedPrivateKey,
							this.state.password
						)
					);
				} else {
					await this.props.dispatch(push('/backupHDWallet'));
				}
				return;
			}
			getGlobalContext().matomoService.trackEvent(
				'wallet_setup',
				'password_create',
				undefined,
				undefined,
				true
			);
			await this.props.dispatch(createWalletOperations.createWalletOperation());
			await this.props.dispatch(push('/backupAddress'));
		} else {
			this.setState({ ...this.state, error: 'Password does not match' });
		}
	};

	render() {
		return (
			<PasswordConfirmation
				onNextClick={this.handleNext}
				onPasswordChange={this.handlePasswordChange}
				backComponent={goBackCreatePassword}
				{...this.state}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		app: appSelectors.selectApp(state),
		firstPassword: createWalletSelectors.selectCreateWallet(state).password
	};
};

export default connect(mapStateToProps)(PasswordConfirmationContainer);
