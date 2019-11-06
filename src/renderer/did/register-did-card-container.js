import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { RegisterDidCard } from './register-did-card';
import { didOperations, didSelectors } from 'common/did';

const SELFKEY_ID_PATH = '/main/selfkeyId';

class RegisterDidCardContainerComponent extends PureComponent {
	handleRegisterDidClick = _ =>
		this.props.dispatch(
			didOperations.startCreateDidFlowOperation(
				this.props.returnPath ? this.props.returnPath : SELFKEY_ID_PATH
			)
		);
	handleAssociateDidClick = _ =>
		this.props.dispatch(
			didOperations.startAssociateDidFlowOperation(
				this.props.returnPath ? this.props.returnPath : SELFKEY_ID_PATH
			)
		);

	render() {
		return (
			<RegisterDidCard
				pending={this.props.pending}
				onRegisterDidClick={this.handleRegisterDidClick}
				onAssociateDidClick={this.handleAssociateDidClick}
			/>
		);
	}
}

export const RegisterDidCardContainer = connect(state => ({
	pending: didSelectors.isCurrentIdentityPending(state)
}))(RegisterDidCardContainerComponent);

export default RegisterDidCardContainer;
