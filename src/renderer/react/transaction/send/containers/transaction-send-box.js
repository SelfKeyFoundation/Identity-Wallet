import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionSendBox } from 'selfkey-ui';
import { ethGasStationInfoOperations, ethGasStationInfoSelectors } from 'common/eth-gas-station';
import { transactionOperations, transactionSelectors } from 'common/transaction';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';

class TransactionSendBoxContainer extends Component {
	componentDidMount() {
		this.loadData();
		this.props.dispatch(transactionOperations.init());
	}

	loadData() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
	}

	onSendAction() {
		this.props.dispatch(transactionOperations.startSend(this.props.cryptoCurrency));
	}

	handleAddressChange(value) {
		this.props.dispatch(transactionOperations.setAddress(value));
	}

	handleAmountChange(value) {
		this.props.dispatch(transactionOperations.setAmount(value));
	}

	handleGasPriceChange(field) {
		this.props.dispatch(transactionOperations.setGasPrice(field.target.value));
	}

	handleGasLimitChange(field) {
		this.props.dispatch(transactionOperations.setGasLimit(field.target.value));
	}

	handleConfirmAction() {
		this.props.dispatch(transactionOperations.confirmSend());
		console.log('TEST, HERE', this.props.navigateToTransactionProgress());
		this.props.navigateToTransactionProgress();
	}

	handleCancelAction() {
		this.props.dispatch(transactionOperations.cancelSend());
	}

	render() {
		return (
			<TransactionSendBox
				onAddressFieldChange={e => this.handleAddressChange(e)}
				onSendAction={() => this.onSendAction()}
				{...this.props}
				reloadEthGasStationInfoAction={() => this.loadData()}
				onAmountInputChange={value => this.handleAmountChange(value)}
				changeGasPriceAction={e => this.handleGasPriceChange(e)}
				changeGasLimitAction={e => this.handleGasLimitChange(e)}
				confirmAction={() => this.handleConfirmAction()}
				cancelAction={() => this.handleCancelAction()}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	console.log(transactionSelectors.getTransaction(state, props.cryptoCurrency));
	return {
		...getLocale(state),
		...getFiatCurrency(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		...transactionSelectors.getTransaction(state, props.cryptoCurrency)
	};
};

export default connect(mapStateToProps)(TransactionSendBoxContainer);
