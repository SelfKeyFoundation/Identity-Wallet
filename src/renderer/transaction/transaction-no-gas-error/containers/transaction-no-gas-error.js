import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionNoGasError } from '../components/transaction-no-gas-error';
import { getWallet } from 'common/wallet/selectors';
import { push } from 'connected-react-router';

class TransactionNoGasErrorContainer extends Component {
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
		publicKey: getWallet(state).publicKey
	};
};

export default connect(mapStateToProps)(TransactionNoGasErrorContainer);
