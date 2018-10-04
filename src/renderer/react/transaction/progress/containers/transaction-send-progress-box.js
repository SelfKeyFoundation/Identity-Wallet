import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionSendProgressBox } from 'selfkey-ui';
import { transactionSelectors } from 'common/transaction';
import { getLocale } from 'common/locale/selectors';

class TransactionSendProgressBoxContainer extends Component {
	render() {
		return <TransactionSendProgressBox {...this.props} />;
	}
}

const mapStateToProps = (state, props) => {
	return {
		...getLocale(state),
		...transactionSelectors.getTransaction(state, props.cryptoCurrency)
	};
};

export default connect(mapStateToProps)(TransactionSendProgressBoxContainer);
