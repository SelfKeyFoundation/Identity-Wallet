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
import { MarketplacePassportsComponent } from '../common/marketplace-passports-component';

const styles = theme => ({});
const CRYPTOCURRENCY = config.constants.primaryToken;
const FIXED_GAS_LIMIT_PRICE = 45000;

class PassportsCheckoutContainerComponent extends MarketplacePassportsComponent {
	async componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
		this.checkIfUserCanApply();
	}

	checkIfUserCanApply = async () => {
		if (!this.canApply(this.props.program.price)) {
			this.props.dispatch(push(this.cancelRoute()));
		}
	};

	getPaymentParameters() {
		const { keyRate, ethRate, ethGasStationInfo, cryptoCurrency, program } = this.props;
		const gasPrice = ethGasStationInfo.fast;
		const price = program.price;
		const keyAmount = price / keyRate;
		const gasLimit = FIXED_GAS_LIMIT_PRICE;
		const ethFee = EthUnits.toEther(gasPrice * gasLimit, 'gwei');
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
		const { program, templateId, vendorId, vendor } = this.props;
		const { country } = program.data;

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
					`Passport/Residency in ${country}`,
					`You are about to begin the application process for passport/residency in ${country}.
					Please double check your required documents are Certified True or Notarized where
					necessary. Failure to do so will result in delays in the process. You may also be
					asked to provide more information by the service provider`,
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
		const { country, checkoutOptions, whatYouGet } = program.data;
		const { price } = program;

		return (
			<PaymentCheckout
				title={`Passport/Residency Application Fee: ${country}`}
				description={`- Consulting Services for obtaining a Passport/Residency in ${country}`}
				timeToForm={''}
				program={program}
				countryCode={countryCode}
				{...this.getPaymentParameters()}
				price={price}
				options={checkoutOptions}
				initialDocsText={`You will be required to provide a few basic information about yourself like full name and email. This will be done through SelfKey ID Wallet.`}
				kycProcessText={`You will undergo a standard KYC process and our team will get in touch with you to make sure we have all the information needed.`}
				getFinalDocsText={`We will help you with the application and investment needed.`}
				whatYouGet={whatYouGet}
				onBackClick={this.onBackClick}
				onStartClick={this.onStartClick}
				startButtonText={'Start Application'}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { programCode, vendorId, countryCode, templateId } = props.match.params;
	const authenticated = true;
	const primaryToken = { ...props, cryptoCurrency: config.constants.primaryToken };
	const program = marketplaceSelectors.selectPassportsByFilter(
		state,
		c => c.data.programCode === programCode
	);
	return {
		countryCode,
		templateId,
		vendorId,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		program,
		...getLocale(state),
		...getFiatCurrency(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		tokens: getTokens(state).splice(1), // remove ETH
		cryptoValue: getCryptoValue(state, primaryToken),
		address: getWallet(state).address,
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

const styledComponent = withStyles(styles)(PassportsCheckoutContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as PassportsCheckoutContainer };
