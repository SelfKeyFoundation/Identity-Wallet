import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionNoGasError } from '../components/transaction-no-gas-error';
import { getWallet } from 'common/wallet/selectors';
import { push } from 'connected-react-router';
import { kycOperations } from 'common/kyc';

class TransactionNoGasErrorContainer extends Component {
	componentDidMount() {
		this.clearRelyingParty();
	}
	clearRelyingParty = async () => {
		// Clear relying party session after an application failure
		await this.props.dispatch(kycOperations.clearRelyingPartyOperation());
	};
	openLink = url => {
		window.openExternal(null, url);
	};
	closeAction = () => {
		this.props.dispatch(push('/main/dashboard'));
	};
	render() {
		return (
			<TransactionNoGasError
				openLink={this.openLink}
				closeAction={this.closeAction}
				{...this.props}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		address: getWallet(state).address
	};
};

export default connect(mapStateToProps)(TransactionNoGasErrorContainer);
