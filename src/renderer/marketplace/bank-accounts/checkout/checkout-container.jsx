import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import config from 'common/config';
import EthUnits from 'common/utils/eth-units';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getWallet } from 'common/wallet/selectors';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import { PaymentCheckout } from '../../common/payment-checkout';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';

const styles = theme => ({});
const CRYPTOCURRENCY = config.constants.primaryToken;
const FIXED_GAS_LIMIT_PRICE = 21000;
const VENDOR_NAME = 'Far Horizon Capital Inc';

class BankAccountsCheckoutContainer extends MarketplaceBankAccountsComponent {
	async componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
		this.checkIfUserCanOpenBankAccount();
	}

	checkIfUserCanOpenBankAccount = async () => {
		if (!this.canApply(this.props.jurisdiction.price)) {
			this.props.dispatch(push(this.cancelRoute()));
		}
	};

	getPaymentParameters() {
		const { keyRate, ethRate, ethGasStationInfo, cryptoCurrency, jurisdiction } = this.props;
		const gasPrice = ethGasStationInfo.fast;
		const price = jurisdiction.price;
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

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onStartClick = async () => {
		const { jurisdiction, templateId, vendorId } = this.props;
		const { region } = jurisdiction.data;

		// TODO: get URLs and vendor name from the RP store
		this.props.dispatch(
			kycOperations.startCurrentApplicationOperation(
				vendorId,
				templateId,
				this.payRoute(),
				this.cancelRoute(),
				`Bank Account in ${region}`,
				`You are about to begin the application process for a bank account in ${region}.
				Please double check your required documents are Certified True or Notarized where
				necessary. Failure to do so will result in delays in the process. You may also be
				asked to provide more information by the service provider`,
				'conducting KYC',
				VENDOR_NAME,
				'https://flagtheory.com/privacy-policy',
				'http://flagtheory.com/terms-and-conditions'
			)
		);
	};

	render() {
		const { jurisdiction, countryCode } = this.props;
		const { region, walletDescription, checkoutOptions, accounts } = jurisdiction.data;

		const timeToOpen = Object.keys(accounts).reduce((current, accountId) => {
			const account = accounts[accountId];
			return current || account.timeToOpen;
		}, '');

		return (
			<PaymentCheckout
				title={`Banking Application Fee: ${region}`}
				description={walletDescription}
				timeToForm={timeToOpen}
				program={jurisdiction}
				countryCode={countryCode}
				{...this.getPaymentParameters()}
				price={jurisdiction.price}
				options={checkoutOptions}
				initialDocsText={`You will be required to provide a few basic informations about yourself like full name and email.
					This will be done through SelfKey ID Wallet.`}
				kycProcessText={`You will undergo a standard KYC process and our team will get in touch with you to make sure we
					have all the information needed.`}
				getFinalDocsText={`Once the account opening process is done you will receive all the relevant documents, access codes
					in persion/via courier or on your email.`}
				onBackClick={this.onBackClick}
				onStartClick={this.onStartClick}
				startButtonText={'Start Application'}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { accountCode, vendorId, countryCode, templateId } = props.match.params;
	const authenticated = true;
	return {
		countryCode,
		templateId,
		vendorId,
		jurisdiction: marketplaceSelectors.selectBankJurisdictionByAccountCode(state, accountCode),
		...getLocale(state),
		...getFiatCurrency(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		tokens: getTokens(state).splice(1), // remove ETH
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

const styledComponent = withStyles(styles)(BankAccountsCheckoutContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsCheckoutContainer };
