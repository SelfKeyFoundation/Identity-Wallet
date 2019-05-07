import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import config from 'common/config';
import { Popup } from '../../../common/popup';
import { Grid, Typography } from '@material-ui/core';
import { HourGlassLargeIcon } from 'selfkey-ui';
import { getIncorporationPrice } from '../common';
import { PaymentConfirmationContent } from './payment-confirmation-content';
import { incorporationsSelectors } from 'common/incorporations';
import { transactionSelectors, transactionOperations } from 'common/transaction';
import { getLocale } from 'common/locale/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { pricesSelectors } from 'common/prices';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import { appOperations, appSelectors } from 'common/app';
import EthUnits from 'common/utils/eth-units';
import { getCryptoValue } from '../../../common/price-utils';
const CRYPTOCURRENCY = config.constants.primaryToken;
const FIXED_GAS_LIMIT_PRICE = 37680;

class CreateDIDComponent extends Component {
	state = {
		open: true,
		isConfirmationOpen: false
	};

	async componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
		const { trezorAccountIndex, cryptoCurrency } = this.props;
		await this.props.dispatch(
			transactionOperations.init({ trezorAccountIndex, cryptoCurrency })
		);

		const { keyAmount, gasPrice, walletAddress, gasLimit } = this.getPaymentParameters();

		this.props.dispatch(transactionOperations.setAddress(walletAddress));
		this.props.dispatch(transactionOperations.setAmount(keyAmount));
		this.props.dispatch(transactionOperations.setGasPrice(gasPrice));
		this.props.dispatch(transactionOperations.setLimitPrice(gasLimit));

		if (this.props.confirmation === 'true') {
			this.setState({ isConfirmationOpen: true });
		}
	}

	getPrice = _ => {
		const { program } = this.props;
		return getIncorporationPrice(program);
	};

	getPaymentParameters = _ => {
		const { keyRate, ethRate, ethGasStationInfo, cryptoCurrency, transaction } = this.props;
		const gasPrice = ethGasStationInfo.fast;
		const walletAddress = this.getVendorWalletAddress();
		const price = this.getPrice();
		const vendorName = this.getVendorName();
		const keyAmount = price / keyRate;
		const gasLimit = transaction.gasLimit ? transaction.gasLimit : FIXED_GAS_LIMIT_PRICE;
		const ethFee = transaction.ethFee
			? transaction.ethFee
			: EthUnits.toEther(gasPrice * gasLimit, 'gwei');
		const usdFee = ethFee * ethRate;

		return {
			cryptoCurrency,
			keyRate,
			gasPrice,
			gasLimit,
			vendorName,
			walletAddress,
			price,
			keyAmount,
			ethFee,
			usdFee
		};
	};

	handleTransferAction = async _ => {
		const { companyCode, countryCode } = this.props.match.params;

		const { keyAmount } = this.getPaymentParameters();
		if (keyAmount > this.props.keyBalance) {
			return this.props.dispatch(push('/main/transaction-no-key-error'));
		}

		await this.props.dispatch(appOperations.setGoBackPath(this.props.location.pathname));

		await this.props.dispatch(
			transactionOperations.incorporationSend(companyCode, countryCode)
		);

		if (this.props.walletType === 'ledger' || this.props.walletType === 'trezor') {
			await this.props.dispatch(
				appOperations.setGoNextPath(`${this.props.location.pathname}/true`)
			);
			this.setState({ isConfirmationOpen: true });
		}
	};

	handleCloseAction = _ => {
		const { companyCode, countryCode, templateId } = this.props.match.params;
		this.props.dispatch(
			push(
				`/main/marketplace-incorporation/details/${companyCode}/${countryCode}/${templateId}`
			)
		);
	};

	// REFACTOR: extract to common popup to be used in multiple places
	renderConfirmationModal = () => {
		const typeText =
			this.props.walletType.charAt(0).toUpperCase() + this.props.walletType.slice(1);
		const text = `Confirm Transaction on ${typeText}`;
		return (
			<Popup
				open={this.state.isConfirmationOpen}
				closeAction={() => this.setState({ isConfirmationOpen: false })}
				text={text}
			>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					spacing={40}
				>
					<Grid item xs={2}>
						<HourGlassLargeIcon />
					</Grid>
					<Grid item xs={10}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
							spacing={40}
						>
							<Grid item>
								<Typography variant="body1">
									You have 30 seconds to confirm this transaction on the{' '}
									{typeText} or it will time out and automatically cancel.
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	};

	render() {
		const { open } = this.state;
		const {
			keyAmount,
			price,
			usdFee,
			ethFee,
			vendorName,
			cryptoCurrency
		} = this.getPaymentParameters();

		return (
			<React.Fragment>
				<Popup
					closeAction={this.handleCloseAction}
					text={'Incorporations Payment Confirmation'}
					open={open}
				>
					<PaymentConfirmationContent
						txId={''}
						name={vendorName}
						crypoCurrency={cryptoCurrency}
						usdFee={price}
						ethFee={keyAmount}
						tooltipFee={
							'Payment will be done using KEY tokens, at the day’s exchange rate.'
						}
						usdNetworkFee={usdFee}
						ethNetworkFee={ethFee}
						tooltipNetworkFee={
							'The fee will be payed in ETH, at the day’s exchange rate.'
						}
						learnHowURL={'https://help.selfkey.org/'}
						onConfirm={this.handleTransferAction}
						onCancel={this.handleCloseAction}
					/>
				</Popup>
				{this.renderConfirmationModal()}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		cryptoCurrency: CRYPTOCURRENCY,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		ethRate: pricesSelectors.getRate(state, 'ETH', 'USD'),
		program: incorporationsSelectors.getIncorporationsDetails(
			state,
			props.match.params.companyCode
		),
		tokens: getTokens(state).splice(1), // remove ETH
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		...getLocale(state),
		...getFiatCurrency(state),
		transaction: transactionSelectors.getTransaction(state),
		walletType: appSelectors.selectWalletType(state),
		keyBalance: getCryptoValue(state, { cryptoCurrency: CRYPTOCURRENCY }),
		confirmation: props.match.params.confirmation
	};
};

export const CreateDID = connect(mapStateToProps)(CreateDIDComponent);

export default CreateDID;
