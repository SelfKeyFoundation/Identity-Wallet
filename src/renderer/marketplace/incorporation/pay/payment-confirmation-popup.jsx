import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popup } from '../../../common/popup';
import { PaymentConfirmationContent } from './payment-confirmation-content';

class PaymentConfirmationPopupComponent extends Component {
	state = {
		open: true
	};

	handleConfirmAction = () => {
		this.setState({ open: false });
	};

	handleCloseAction = () => {
		this.setState({ open: false });
	};

	render() {
		const { open } = this.state;
		const { tx, incorporation } = this.props;
		return (
			<Popup
				closeAction={this.handleCloseAction}
				text={'Incorporations Payment Confirmation'}
				open={open}
			>
				<PaymentConfirmationContent
					txId={tx.id}
					name={incorporation.name}
					crypoCurrency={tx.crypoCurrency}
					usdFee={tx.amount}
					ethFee={tx.fee}
					usdNetworkFee={tx.networkAmount}
					ethNetworkFee={tx.networkFee}
					onConfirm={this.handleConfirmAction}
					onCancel={this.handleCloseAction}
				/>
			</Popup>
		);
	}
}

const mapStateToProps = state => {
	return {
		tx: {
			id: 'r34985456gjhsfkfb',
			crypoCurrency: 'KEY',
			amount: 6200,
			fee: 1.25,
			networkAmount: 0.01,
			networkFee: 0.3237484
		},
		incorporation: {
			name: 'Far Horizon Capital Inc'
		}
	};
};

export const PaymentConfirmationPopup = connect(mapStateToProps)(PaymentConfirmationPopupComponent);

export default PaymentConfirmationPopup;
