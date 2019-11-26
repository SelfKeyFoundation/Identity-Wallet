import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { TransactionNoKeyError } from '../components/transaction-no-key-error';
import { getWallet } from 'common/wallet/selectors';
import { kycOperations } from 'common/kyc';
import history from 'common/store/history';

class TransactionNoKeyErrorContainer extends PureComponent {
	componentDidMount() {
		this.clearRelyingParty();
	}
	clearRelyingParty = async () => {
		// Clear relying party session after an application failure
		await this.props.dispatch(kycOperations.clearRelyingPartyOperation());
	};
	closeAction = () => {
		history.getHistory().goBack();
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
