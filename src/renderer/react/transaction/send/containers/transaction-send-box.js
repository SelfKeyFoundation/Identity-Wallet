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
		this.props.dispatch(transactionOperations.init(this.props.cryptoCurrency));
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
		if (this.props.isHardwareWallet) {
			this.props.showConfirmTransactionInfoModal();
		}
		try {
			await this.props.dispatch(transactionOperations.startSend());
		} catch (error) {
			this.processSignTxError(error);
		}

		this.props.closeModal(); // neded for hardware wallets to close info modals
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
		this.props.dispatch(transactionOperations.setLimitPrice(field.target.value));
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
				changeGasPriceAction={e => this.handleGasPriceChange(e)}
				changeGasLimitAction={e => this.handleGasLimitChange(e)}
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
		tokens: getTokens(state),
		cryptoCurrency: props.cryptoCurrency
	};
};

export default connect(mapStateToProps)(TransactionSendBoxContainer);
