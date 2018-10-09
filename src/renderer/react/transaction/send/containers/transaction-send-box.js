import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionSendBox } from 'selfkey-ui';
import { ethGasStationInfoOperations, ethGasStationInfoSelectors } from 'common/eth-gas-station';
import { transactionOperations, transactionSelectors } from 'common/transaction';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';

class TransactionSendBoxContainer extends Component {
	componentDidMount() {
		this.loadData();

		let { trezorAccountIndex, cryptoCurrency } = this.props;
		this.props.dispatch(transactionOperations.init({ trezorAccountIndex, cryptoCurrency }));
	}

	loadData() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
	}

	processSignTxError(error) {
		if (this.props.isHardwareWallet) {
			this.props.norifySignTxFailure(error);
		}
		console.log('error', error);
	}

	async onSendAction() {
		const { walletProfile } = this.props;
		if (walletProfile === 'ledger') {
			this.props.showConfirmTransactionInfoModal();
		}
		try {
			await this.props.dispatch(transactionOperations.startSend());
		} catch (error) {
			this.processSignTxError(error);
		}

		if (walletProfile === 'ledger') {
			this.props.closeModal();
		}
	}

	handleAddressChange(value) {
		this.props.dispatch(transactionOperations.setAddress(value));
	}

	handleAmountChange(value) {
		this.props.dispatch(transactionOperations.setAmount(value));
	}

	handleGasPriceChange(value) {
		this.props.dispatch(transactionOperations.setGasPrice(value));
	}

	handleGasLimitChange(value) {
		this.props.dispatch(transactionOperations.setLimitPrice(value));
	}

	handleConfirmActionError(err) {
		let message = err.toString().toLowerCase();
		if (message.indexOf('insufficient funds') !== -1 || message.indexOf('underpriced') !== -1) {
			return this.props.navigateToTransactionNoGasError();
		}
		this.props.navigateToTransactionError(message);
	}

	async handleConfirmAction() {
		try {
			this.props.navigateToTransactionProgress();
			await this.props.dispatch(transactionOperations.confirmSend());
		} catch (err) {
			this.handleConfirmActionError(err);
		}
	}

	handleCancelAction() {
		this.props.dispatch(transactionOperations.cancelSend());
	}

	handleCryptoCurrencyChange(value) {
		this.props.dispatch(transactionOperations.setCryptoCurrency(value));
	}

	render() {
		return (
			<TransactionSendBox
				onAddressFieldChange={e => this.handleAddressChange(e)}
				onSendAction={() => this.onSendAction()}
				{...this.props}
				reloadEthGasStationInfoAction={() => this.loadData()}
				onAmountInputChange={value => this.handleAmountChange(value)}
				changeGasPriceAction={value => this.handleGasPriceChange(value)}
				changeGasLimitAction={value => this.handleGasLimitChange(value)}
				confirmAction={() => this.handleConfirmAction()}
				cancelAction={() => this.handleCancelAction()}
				onCryptoCurrencyChange={value => this.handleCryptoCurrencyChange(value)}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...getLocale(state),
		...getFiatCurrency(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		...transactionSelectors.getTransaction(state),
		tokens: getTokens(state).splice(1), // remove ETH
		cryptoCurrency: props.cryptoCurrency
	};
};

export default connect(mapStateToProps)(TransactionSendBoxContainer);
