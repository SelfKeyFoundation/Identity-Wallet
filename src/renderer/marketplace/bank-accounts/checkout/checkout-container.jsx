import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { MarketplaceComponent, getCheckoutProps } from '../../common/marketplace-component';
import { ethGasStationInfoOperations } from 'common/eth-gas-station';
import { kycOperations } from 'common/kyc';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { PaymentCheckout } from '../../common/payment-checkout';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';

class BankAccountsCheckoutContainer extends MarketplaceComponent {
	async componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());

		const authenticated = true;
		// If session is not authenticated, reauthenticate with KYC-Chain
		// Otherwise, just check if user has already applied to redirect
		// back to incorporations page

		if (this.props.rpShouldUpdate) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty('incorporations', authenticated)
			);
		} else {
			await this.checkIfUserCanOpenBankAccount();
		}

		if (!this.props.accountType) {
			await this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}
	}

	canUserOpenBankAccount = () => {
		const { templateId } = this.props.match.params;
		const price = this.props.accountType.price;

		if (this.props.rp && this.props.rp.authenticated) {
			return !!(
				templateId &&
				price &&
				(!this.userHasApplied() || this.applicationWasRejected())
			);
		} else {
			return !!(templateId && price);
		}
	};

	checkIfUserCanOpenBankAccount = async () => {
		if (!this.canApply(this.props.accountType.price)) {
			this.props.dispatch(push(this.getCancelRoute()));
		}
	};

	getPrice() {
		return this.props.accountType.price;
	}

	getCancelRoute = () => {
		const { accountCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/details/${accountCode}/${countryCode}/${templateId}`;
	};

	getPayRoute = () => {
		const { accountCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/pay/${accountCode}/${countryCode}/${templateId}`;
	};

	onBackClick = () => this.props.dispatch(push(this.getCancelRoute()));

	onStartClick = _ => {
		const { accountType } = this.props;
		const { templateId } = this.props.match.params;
		const region = accountType.region;

		this.props.dispatch(
			kycOperations.startCurrentApplicationOperation(
				'incorporations',
				templateId,
				this.getPayRoute(),
				this.getCancelRoute(),
				region,
				`You are about to begin the application process for a bank account in ${region}.
				Please double check your required documents are Certified True or Notarized where
				necessary. Failure to do so will result in delays in the process. You may also be
				asked to provide more information by the service provider`,
				'conducting KYC',
				'Far Horizon Capital Inc',
				'https://flagtheory.comw/privacy-policy',
				'http://flagtheory.com/terms-and-conditions'
			)
		);
	};

	render() {
		const { accountType, banks } = this.props;
		const countryCode = this.props.match.params.countryCode;
		return (
			<PaymentCheckout
				title={`Banking Application Fee: ${accountType.region}`}
				description={accountType.walletDescription}
				timeToForm={banks[0].timeToOpen}
				program={accountType}
				countryCode={countryCode}
				{...this.getPaymentParameters()}
				price={accountType.price}
				options={accountType.checkoutOptions}
				initialDocsText={this.DEFAULT_DOCS_TEXT}
				kycProcessText={this.DEFAULT_KYC_PROCESS_TEXT}
				getFinalDocsText={
					'Once the account opening process is done you will receive all the relevant documents, access codes in persion/via courier or on your email.'
				}
				onBackClick={this.onBackClick}
				onStartClick={this.onStartClick}
				startButtonText={'Pay Fee'}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { accountCode, countryCode } = props.match.params;

	return {
		...getCheckoutProps(state, props),
		accountType: bankAccountsSelectors.getTypeByAccountCode(state, accountCode),
		banks: bankAccountsSelectors.getDetailsByAccountCode(state, accountCode),
		jurisdiction: bankAccountsSelectors.getJurisdictionsByCountryCode(state, countryCode)
	};
};

const styledComponent = withStyles(styles)(BankAccountsCheckoutContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsCheckoutContainer };
