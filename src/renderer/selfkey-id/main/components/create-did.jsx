import React, { Component } from 'react';
import { connect } from 'react-redux';
import config from 'common/config';
import { Popup } from '../../../common/popup';
import { CreateDIDContent } from './create-did-content';
import { getLocale } from 'common/locale/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { pricesSelectors } from 'common/prices';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import { appOperations, appSelectors } from 'common/app';
import { gasSelectors, gasOperations } from 'common/gas';
import { walletOperations } from 'common/wallet';
import EthUnits from 'common/utils/eth-units';
import { push } from 'connected-react-router';

const CRYPTOCURRENCY = config.constants.primaryToken;

class CreateDIDComponent extends Component {
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
		await this.props.dispatch(appOperations.setGoBackPath('/main/selfkeyId'));
		await this.props.dispatch(walletOperations.createWalletDID());
		if (this.props.walletType === 'ledger' || this.props.walletType === 'trezor') {
			await this.props.dispatch(appOperations.setGoNextPath('/main/hd-transaction-timer'));
		}
	};

	handleCloseAction = _ => {
		this.props.dispatch(push('/main/selfkeyId'));
	};

	render() {
		const { open } = this.state;
		const { usdFee, ethFee, cryptoCurrency } = this.getPaymentParameters();
		return (
			<React.Fragment>
				<Popup
					closeAction={this.handleCloseAction}
					text={'Register on the Selfkey Network'}
					open={open}
				>
					<CreateDIDContent
						crypoCurrency={cryptoCurrency}
						usdNetworkFee={usdFee}
						ethNetworkFee={ethFee}
						tooltipNetworkFee={
							'The fee will be paid in ETH, at the day’s exchange rate.'
						}
						learnHowURL={'https://help.selfkey.org/'}
						onConfirm={this.handleCreateDIDAction}
						onCancel={this.handleCloseAction}
					/>
				</Popup>
			</React.Fragment>
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
		gasLimit: gasSelectors.selectGas(state).didGasLimit
	};
};

export const CreateDID = connect(mapStateToProps)(CreateDIDComponent);

export default CreateDID;
