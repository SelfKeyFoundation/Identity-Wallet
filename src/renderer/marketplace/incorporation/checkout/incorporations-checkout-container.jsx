import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/styles';
import { BigNumber } from 'bignumber.js';
import config from 'common/config';
import EthUnits from 'common/utils/eth-units';
import { getCryptoValue } from '../../../common/price-utils';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getWallet } from 'common/wallet/selectors';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import { PaymentCheckout } from '../../common/payment-checkout';
import { MarketplaceIncorporationsComponent } from '../common/marketplace-incorporations-component';

const styles = theme => ({});
const CRYPTOCURRENCY = config.constants.primaryToken;
const FIXED_GAS_LIMIT_PRICE = 45000;

class IncorporationsCheckoutContainer extends MarketplaceIncorporationsComponent {
	async componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
		this.checkIfUserCanIncorporate();
	}

	checkIfUserCanIncorporate = async () => {
		if (!this.canApply(this.props.program.price)) {
			this.props.dispatch(push(this.cancelRoute()));
		}
	};

	getPaymentParameters() {
		const { keyRate, ethRate, ethGasStationInfo, cryptoCurrency, program } = this.props;
		const gasPrice = ethGasStationInfo ? ethGasStationInfo.average : 50;
		const maxPriorityFee =
			ethGasStationInfo && ethGasStationInfo.fees && ethGasStationInfo.fees.medium
				? ethGasStationInfo.fees.medium.suggestedMaxFeePerGas
				: 1;
		const price = program.price;
		const keyAmount = price / keyRate;
		const gasLimit = FIXED_GAS_LIMIT_PRICE;
		const ethFee = EthUnits.toEther((gasPrice + maxPriorityFee) * gasLimit, 'gwei');
		const usdFee = ethFee * ethRate;

		return {
			cryptoCurrency,
			keyRate,
			gasPrice,
			gasLimit,
			price,
			keyAmount,
			ethFee,
			usdFee
		};
	}

	priceInKEY = priceUSD => new BigNumber(priceUSD).dividedBy(this.props.keyRate);

	keyAvailable = () => new BigNumber(this.props.cryptoValue);

	onStartClick = async () => {
		const { program, vendorId, templateId, vendor } = this.props;
		const { region } = program.data;

		const keyPrice = this.priceInKEY(program.price);
		const keyAvailable = this.keyAvailable();
		const transactionNoKeyError = `/main/transaction-no-key-error/${keyPrice}`;

		if (keyPrice.gt(keyAvailable)) {
			return this.props.dispatch(push(transactionNoKeyError));
		} else {
			this.props.dispatch(
				kycOperations.startCurrentApplicationOperation(
					vendorId,
					templateId,
					this.payRoute(),
					this.cancelRoute(),
					`Incorporate in ${region}`,
					`You are about to begin the incorporation process in ${region}. Please double check your
					required documents are Certified True or Notarized where necessary. Failure to do so
					will result in delays in the incorporation process. You may also be asked to provide
					more information by the service provider`,
					'conducting KYC',
					vendor.name,
					vendor.privacyPolicy,
					vendor.termsOfService
				)
			);
		}
	};

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	render() {
		const { program, countryCode } = this.props;
		const { region } = program.data;
		const description = program.data.walletDescription
			? program.data.walletDescription
			: program.data.servicesDescription;

		return (
			<PaymentCheckout
				title={`Pay Incorporation Fee: ${region}`}
				description={description}
				timeToForm={program.data.timeToFormWeeks}
				program={program}
				countryCode={countryCode}
				{...this.getPaymentParameters()}
				options={program.data.checkoutOptions}
				price={program.price}
				onBackClick={this.onBackClick}
				onStartClick={this.onStartClick}
				startButtonText={'Start Application'}
				initialDocsText={`You will be required to provide a few basic information about yourself like full name and email. This will be done through SelfKey ID Wallet.`}
				kycProcessText={`You will undergo a standard KYC process and our team will get in touch with you to make sure we have all the information needed.`}
				getFinalDocsText={`Once the Incorporation process is done you will receive all the relevant documents, for your new company, on your email.`}
				whatYouGet={program.whatYouGet}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { companyCode, countryCode, templateId, vendorId } = props.match.params;
	const authenticated = true;
	const primaryToken = { ...props, cryptoCurrency: config.constants.primaryToken };
	return {
		countryCode,
		templateId,
		vendorId,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		program: marketplaceSelectors.selectIncorporationByFilter(
			state,
			c => c.data.companyCode === companyCode
		),
		...getLocale(state),
		...getFiatCurrency(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		tokens: getTokens(state).splice(1), // remove ETH
		address: getWallet(state).address,
		cryptoValue: getCryptoValue(state, primaryToken),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		ethRate: pricesSelectors.getRate(state, 'ETH', 'USD'),
		cryptoCurrency: CRYPTOCURRENCY,
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			vendorId,
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(IncorporationsCheckoutContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as IncorporationsCheckoutContainer };
