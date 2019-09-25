import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RegisterDidCard } from './register-did-card';
import { walletOperations, walletSelectors } from 'common/wallet';

const SELFKEY_ID_PATH = '/main/selfkeyId';

class RegisterDidCardContainerComponent extends Component {
	handleRegisterDidClick = _ =>
		this.props.dispatch(walletOperations.startCreateDidFlow(SELFKEY_ID_PATH));
	handleAssociateDidClick = _ =>
		this.props.dispatch(walletOperations.startAssociateDidFlow(SELFKEY_ID_PATH));

	render() {
		return (
			<RegisterDidCard
				pending={this.props.wallet.didPending}
				onRegisterDidClick={this.handleRegisterDidClick}
				onAssociateDidClick={this.handleAssociateDidClick}
			/>
		);
	}
}

export const RegisterDidCardContainer = connect(state => ({
	wallet: walletSelectors.getWallet(state)
}))(RegisterDidCardContainerComponent);

export default RegisterDidCardContainer;
