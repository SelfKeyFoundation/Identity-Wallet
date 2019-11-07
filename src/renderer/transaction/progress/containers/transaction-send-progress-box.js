import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { TransactionSendProgressBox } from '../components/transaction-send-progress-box';
import { transactionSelectors } from 'common/transaction';
import { getLocale } from 'common/locale/selectors';
import { push } from 'connected-react-router';

class TransactionSendProgressBoxContainer extends PureComponent {
	openLink = url => {
		window.openExternal(null, url);
	};

	closeAction = () => {
		this.props.dispatch(push('/main/dashboard'));
	};
	render() {
		return (
			<TransactionSendProgressBox
				openLink={this.openLink}
				closeAction={this.closeAction}
				{...this.props}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		...getLocale(state),
		...transactionSelectors.getTransaction(state)
	};
};

export default connect(mapStateToProps)(TransactionSendProgressBoxContainer);
