import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { TransactionNoKeyError } from '../components/transaction-no-key-error';
import { getWallet } from 'common/wallet/selectors';
import { kycOperations } from 'common/kyc';
import { exchangesSelectors } from 'common/exchanges';
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
		return <TransactionNoKeyError closeAction={this.closeAction} keyPrice {...this.props} />;
	}
}

const mapStateToProps = (state, props) => {
	const { keyPrice } = props.match.params;
	return {
		address: getWallet(state).address,
		listingExchanges: exchangesSelectors.selectListingExchanges(state),
		keyPrice
	};
};

export default connect(mapStateToProps)(TransactionNoKeyErrorContainer);
