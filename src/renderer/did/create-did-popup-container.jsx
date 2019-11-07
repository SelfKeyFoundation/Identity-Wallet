import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import config from 'common/config';

import { CreateDIDPopup } from './create-did-popup';
import { getLocale } from 'common/locale/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { pricesSelectors } from 'common/prices';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import { appOperations, appSelectors } from 'common/app';
import { gasSelectors, gasOperations } from 'common/gas';
import { didSelectors, didOperations } from 'common/did';
import EthUnits from 'common/utils/eth-units';
import { push } from 'connected-react-router';

const CRYPTOCURRENCY = config.constants.primaryToken;

class CreateDIDPopupContainerComponent extends PureComponent {
	state = {
		open: true,
		isConfirmationOpen: false
	};

	async componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
		this.props.dispatch(gasOperations.loadDIDGasLimitOperation());
	}

	getPaymentParameters = _ => {
		const { ethRate, ethGasStationInfo, cryptoCurrency, gasLimit } = this.props;
		const gasPrice = ethGasStationInfo.fast;
		const ethFee = EthUnits.toEther(gasPrice * gasLimit, 'gwei');
		const usdFee = ethFee * ethRate;

		return {
			cryptoCurrency,
			gasPrice,
			gasLimit,
			ethFee,
			usdFee
		};
	};

	handleCreateDIDAction = async _ => {
		await this.props.dispatch(appOperations.setGoBackPath('/main/get-did'));
		await this.props.dispatch(didOperations.createDIDOperation());
		if (this.props.walletType === 'ledger' || this.props.walletType === 'trezor') {
			await this.props.dispatch(appOperations.setGoNextPath('/main/hd-transaction-timer'));
		}
	};

	handleCloseAction = _ => {
		this.props.dispatch(push(this.props.didOriginUrl));
	};

	handleLearnHowClicked = e => {
		window.openExternal(e, 'https://help.selfkey.org/');
	};

	render() {
		const { open } = this.state;
		const { usdFee, ethFee, cryptoCurrency } = this.getPaymentParameters();
		return (
			<CreateDIDPopup
				crypoCurrency={cryptoCurrency}
				usdNetworkFee={usdFee}
				ethNetworkFee={ethFee}
				tooltipNetworkFee={'The fee will be paid in ETH, at the day’s exchange rate.'}
				onConfirm={this.handleCreateDIDAction}
				onCancel={this.handleCloseAction}
				onLearnHowClicked={this.handleLearnHowClicked}
				open={open}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		cryptoCurrency: CRYPTOCURRENCY,
		ethRate: pricesSelectors.getRate(state, 'ETH', 'USD'),
		tokens: getTokens(state).splice(1), // remove ETH
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		...getLocale(state),
		...getFiatCurrency(state),
		walletType: appSelectors.selectWalletType(state),
		gasLimit: gasSelectors.selectGas(state).didGasLimit,
		didOriginUrl: didSelectors.selectOriginUrl(state)
	};
};

export const CreateDIDPopupContainer = connect(mapStateToProps)(CreateDIDPopupContainerComponent);

export default CreateDIDPopupContainer;
