import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionDeclined } from '../components/transaction-declined';
import { getWallet } from 'common/wallet/selectors';
import { push } from 'connected-react-router';

class TransactionDeclinedContainer extends Component {
	closeAction = () => {
		this.props.dispatch(push('/main/dashboard'));
	};
	render() {
		return <TransactionDeclined closeAction={this.closeAction} {...this.props} />;
	}
}

const mapStateToProps = state => {
	return {
		publicKey: getWallet(state).publicKey
	};
};

export default connect(mapStateToProps)(TransactionDeclinedContainer);
