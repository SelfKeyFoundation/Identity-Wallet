import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionDeclined } from '../components/transaction-declined';
import { getWallet } from 'common/wallet/selectors';
import { push } from 'connected-react-router';
import { kycOperations } from 'common/kyc';

class TransactionDeclinedContainer extends Component {
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
		return <TransactionDeclined closeAction={this.closeAction} {...this.props} />;
	}
}

const mapStateToProps = state => {
	return {
		address: getWallet(state).address
	};
};

export default connect(mapStateToProps)(TransactionDeclinedContainer);
