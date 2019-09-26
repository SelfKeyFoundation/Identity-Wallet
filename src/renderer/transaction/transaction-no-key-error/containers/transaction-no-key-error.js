import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionNoKeyError } from '../components/transaction-no-key-error';
import { getWallet } from 'common/wallet/selectors';
import { push } from 'connected-react-router';
import { kycOperations } from 'common/kyc';

class TransactionNoKeyErrorContainer extends Component {
	componentDidMount() {
		this.clearRelyingParty();
	}
	clearRelyingParty = async () => {
		// Clear relying party session after an application failure
		await this.props.dispatch(kycOperations.clearRelyingPartyOperation());
	};
	closeAction = () => {
		this.props.dispatch(push('/main/dashboard'));
	};
	render() {
		return <TransactionNoKeyError closeAction={this.closeAction} {...this.props} />;
	}
}

const mapStateToProps = state => {
	return {
		address: getWallet(state).address
	};
};

export default connect(mapStateToProps)(TransactionNoKeyErrorContainer);
