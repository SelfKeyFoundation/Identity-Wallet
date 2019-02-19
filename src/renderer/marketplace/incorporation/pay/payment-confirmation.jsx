import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popup } from '../../../common/popup';
import { PaymentConfirmationContent } from './payment-confirmation-content';
import { incorporationsSelectors } from 'common/incorporations';
import { pricesSelectors } from 'common/prices';
import { ethGasStationInfoSelectors } from 'common/eth-gas-station';
import EthUnits from 'common/utils/eth-units';

class IncorporationPaymentConfirmationComponent extends Component {
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
		console.log(this.props);
		const { open } = this.state;
		const { tx, incorporation, program, keyRate, ethRate } = this.props;
		const { fast } = this.props.ethGasStationInfo;

		const numeric = parseInt(
			this.props.program['Wallet Price'].replace(/\$/, '').replace(/,/, '')
		);
		const keyValue = numeric / keyRate;

		const ethFee = EthUnits.toEther(fast, 'gwei');
		const usdFee = ethFee / ethRate;

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
					usdFee={program['Wallet Price']}
					ethFee={keyValue}
					tooltipFee={'Cost tooltip text.'}
					usdNetworkFee={ethFee}
					ethNetworkFee={usdFee}
					tooltipNetworkFee={'Network tooltip text.'}
					learnHowURL={'https://help.selfkey.org/'}
					onConfirm={this.handleConfirmAction}
					onCancel={this.handleCloseAction}
				/>
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
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
		},
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		ethRate: pricesSelectors.getRate(state, 'ETH', 'USD'),
		program: incorporationsSelectors.getIncorporationsDetails(
			state,
			props.match.params.companyCode
		),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state)
	};
};

export const IncorporationPaymentConfirmation = connect(mapStateToProps)(
	IncorporationPaymentConfirmationComponent
);

export default IncorporationPaymentConfirmation;
