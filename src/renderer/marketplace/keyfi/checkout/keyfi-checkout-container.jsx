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
import { KeyFiCheckout } from './keyfi-checkout';
import { MarketplaceKeyFiComponent } from '../common/marketplace-keyfi-component';
import { identitySelectors } from 'common/identity';

const styles = theme => ({});
const CRYPTOCURRENCY = config.constants.primaryToken;
const FIXED_GAS_LIMIT_PRICE = 21000;

class MarketplaceKeyFiCheckoutContainerComponent extends MarketplaceKeyFiComponent {
	state = {
		cryptoCurrency: CRYPTOCURRENCY
	};

	async componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
		this.checkIfUserCanOpenBankAccount();
	}

	checkIfUserCanOpenBankAccount = async () => {
		/*
		if (!this.canApply(this.props.jurisdiction.price)) {
			this.props.dispatch(push(this.cancelRoute()));
		}
		*/
	};

	getPaymentParameters() {
		const { keyRate, ethRate, ethGasStationInfo, cryptoCurrency, product } = this.props;
		const gasPrice = ethGasStationInfo.fast;
		const price = product.price;
		const ethPrice = price;
		const keyPrice = price * 0.8;
		const keyAmount = keyPrice / keyRate;
		const ethAmount = ethPrice / ethRate;
		const gasLimit = FIXED_GAS_LIMIT_PRICE;
		const ethFee = EthUnits.toEther(gasPrice * gasLimit, 'gwei');
		const usdFee = ethFee * ethRate;

		return {
			cryptoCurrency,
			keyRate,
			gasPrice,
			gasLimit,
			price,
			keyPrice,
			ethPrice,
			keyAmount,
			ethFee,
			usdFee,
			ethAmount
		};
	}

	priceInKEY = priceUSD => new BigNumber(priceUSD).dividedBy(this.props.keyRate);

	keyAvailable = () => new BigNumber(this.props.cryptoValue);

	onSelectCrypto = cryptoCurrency => this.setState({ cryptoCurrency });

	onStartClick = async () => {
		const { templateId, vendorId, vendor, product } = this.props;

		const keyPrice = this.priceInKEY(product.price);
		const keyAvailable = this.keyAvailable();
		const transactionNoKeyError = `/main/transaction-no-key-error/${keyPrice}`;
		const { cryptoCurrency } = this.state;

		if (keyPrice.gt(keyAvailable)) {
			return this.props.dispatch(push(transactionNoKeyError));
		} else {
			this.props.dispatch(
				kycOperations.startCurrentApplicationOperation(
					vendorId,
					templateId,
					this.payRoute(cryptoCurrency),
					this.cancelRoute(),
					`KeyFi.ai Credentials`,
					`You are about to begin the application process for getting credentials for KeyFi.ai.
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

	// Status bar component allows for an action button on the right
	// This handler processes the action for that button
	onStatusActionClick = () => {
		const { rp } = this.props;
		if (rp && rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted() || this.applicationWasRejected()) {
				this.props.dispatch(push(this.manageApplicationsRoute()));
			} else if (this.applicationRequiresAdditionalDocuments()) {
				this.redirectToKYCC(rp);
			} else if (!this.userHasPaid()) {
				this.props.dispatch(push(this.payRoute()));
			} else if (!this.userHasSelectedBankPreference()) {
				this.props.dispatch(push(this.selectBankRoute()));
			}
		}
		return null;
	};

	render() {
		const { cryptoCurrency } = this.state;
		return (
			<KeyFiCheckout
				title={`Get your SelfKey Credentials to access KeyFi.ai`}
				{...this.getPaymentParameters()}
				price={this.props.product.price}
				onBackClick={this.onBackClick}
				onStartClick={this.onStartClick}
				startButtonText={'Start Application'}
				kycRequirements={this.props.kycRequirements}
				templateId={this.props.templateId}
				loading={this.props.loading}
				cryptoCurrency={cryptoCurrency}
				primaryToken={this.props.primaryToken}
				onSelectCrypto={this.onSelectCrypto}
				applicationStatus={this.getApplicationStatus()}
				onStatusAction={this.onStatusActionClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { vendorId, productId, templateId } = props.match.params;
	const authenticated = true;
	const primaryToken = { ...props, cryptoCurrency: config.constants.primaryToken };

	const identity = identitySelectors.selectIdentity(state);
	const product = marketplaceSelectors.selectInventoryItemBySku(
		state,
		'keyfi_kyc',
		identity.type
	);

	const application = kycSelectors.selectApplications(state).find(app => app.rpName === 'keyfi');

	return {
		productId,
		templateId,
		vendorId,
		product,
		application,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		...getLocale(state),
		...getFiatCurrency(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		tokens: getTokens(state).splice(1), // remove ETH
		cryptoValue: getCryptoValue(state, primaryToken),
		address: getWallet(state).address,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		ethRate: pricesSelectors.getRate(state, 'ETH', 'USD'),
		primaryToken: CRYPTOCURRENCY,
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		loading: marketplaceSelectors.isInventoryLoading(state),
		kycRequirements: kycSelectors.selectRequirementsForTemplate(state, vendorId, templateId),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			vendorId,
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(MarketplaceKeyFiCheckoutContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as MarketplaceKeyFiCheckoutContainer };
