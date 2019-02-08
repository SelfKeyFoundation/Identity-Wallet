import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionSendProgressBox } from '../components/transaction-send-progress-box';
import { transactionSelectors } from 'common/transaction';
import { getLocale } from 'common/locale/selectors';

class TransactionSendProgressBoxContainer extends Component {
	openLink = url => {
		window.openExternal(null, url);
	};
	render() {
		return <TransactionSendProgressBox openLink={this.openLink} {...this.props} />;
	}
}

const mapStateToProps = state => {
	return {
		...getLocale(state),
		...transactionSelectors.getTransaction(state)
	};
};

export default connect(mapStateToProps)(TransactionSendProgressBoxContainer);
