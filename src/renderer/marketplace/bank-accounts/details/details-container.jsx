import React from 'react';
import PropTypes from 'prop-types';
import { BigNumber } from 'bignumber.js';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { walletSelectors } from 'common/wallet';
import { withStyles } from '@material-ui/core/styles';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { BankingDetailsPage } from './details-page';
import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';
import config from 'common/config';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';

class BankAccountsDetailContainer extends MarketplaceBankAccountsComponent {
	state = {
		tab: 'types',
		loading: false,
		cryptoValue: 0
	};

	async componentDidMount() {
		const { accountType, country } = this.props;

		if (!accountType) {
			await this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}

		await this.loadRelyingParty({ rp: 'incorporations', authenticated: false });

		if (!country) {
			this.props.dispatch(
				incorporationsOperations.loadIncorporationsCountryOperation(
					this.props.match.params.countryCode
				)
			);
		}
	}

	manageApplicationsRoute = () => {
		return `/main/selfkeyIdApplications`;
	};

	payRoute = () => {
		const { countryCode, accountCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/pay/${accountCode}/${countryCode}/${templateId}`;
	};

	checkoutRoute = () => {
		const { countryCode, accountCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/checkout/${accountCode}/${countryCode}/${templateId}`;
	};

	onBackClick = () => this.props.dispatch(push(MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH));

	onTabChange = tab => this.setState({ tab });

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

	priceInKEY = priceUSD => {
		return new BigNumber(priceUSD).dividedBy(this.props.keyRate).toString();
	};

	onApplyClick = () => {
		const { rp, wallet, accountType } = this.props;
		const selfkeyIdRequiredRoute = '/main/marketplace-selfkey-id-required';
		const selfkeyDIDRequiredRoute = '/main/marketplace-selfkey-did-required';
		const transactionNoKeyError = '/main/transaction-no-key-error';
		const authenticated = true;
		const keyPrice = Number(this.priceInKEY(accountType.price));
		const keyAvailable = this.state.cryptoValue;
		// When clicking the start process,
		// we check if an authenticated kyc-chain session exists
		// If it doesn't we trigger a new authenticated rp session
		// and redirect to checkout route
		// The loading state is used to disable the button while data is being loaded
		this.setState({ loading: true }, async () => {
			if (!wallet.isSetupFinished) {
				return this.props.dispatch(push(selfkeyIdRequiredRoute));
			}
			if (!wallet.did) {
				return this.props.dispatch(push(selfkeyDIDRequiredRoute));
			}
			if (keyPrice > keyAvailable) {
				return this.props.dispatch(push(transactionNoKeyError));
			}
			if (!rp || !rp.authenticated) {
				await this.props.dispatch(
					kycOperations.loadRelyingParty(
						'incorporations',
						authenticated,
						this.checkoutRoute(),
						this.cancelRoute()
					)
				);
			} else {
				await this.props.dispatch(push(this.checkoutRoute()));
			}
		});
	};

	buildResumeData = banks => {
		return [
			[
				{
					name: 'Min. Initial Deposit',
					value: banks[0].minInitialDeposit,
					highlighted: true
				},
				{
					name: 'Min. Monthly Balance',
					value: banks[0].minMonthlyBalance,
					highlighted: true
				}
			],
			[
				{
					name: 'Personal Visit Required',
					value: banks[0].personalVisitRequired ? 'Yes' : 'No',
					highlighted: true
				},
				{
					name: 'Time to open',
					value: banks[0].timeToOpen,
					highlighted: true
				}
			],
			[
				{
					name: 'Cards',
					value: banks[0].cards.join(' '),
					highlighted: true
				}
			]
		];
	};

	handleCryptoValueChange = cryptoValue => {
		this.setState({ cryptoValue: Number(cryptoValue) });
	};

	render() {
		const { accountType, banks, keyRate, jurisdiction, kycRequirements, country } = this.props;
		const { price, countryCode, region } = accountType;
		return (
			<BankingDetailsPage
				applicationStatus={this.getApplicationStatus()}
				loading={this.state.loading || this.props.isLoading}
				accountType={accountType}
				country={country}
				countryCode={countryCode}
				price={price}
				tab={this.state.tab}
				onTabChange={this.onTabChange}
				keyRate={keyRate}
				region={region}
				banks={banks}
				resume={this.buildResumeData(banks)}
				jurisdiction={jurisdiction}
				canOpenBankAccount={this.canApply(price)}
				startApplication={this.onApplyClick}
				kycRequirements={kycRequirements}
				templateId={this.props.match.params.templateId}
				onBack={this.onBackClick}
				onStatusAction={this.onStatusActionClick}
				cryptoCurrency={config.constants.primaryToken}
				cryptoValueChange={this.handleCryptoValueChange}
			/>
		);
	}
}

BankAccountsDetailContainer.propTypes = {
	accountType: PropTypes.object,
	banks: PropTypes.object,
	jurisdictions: PropTypes.object,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	const { accountCode, countryCode, templateId } = props.match.params;
	const authenticated = true;
	return {
		accountType: bankAccountsSelectors.getTypeByAccountCode(state, accountCode),
		banks: bankAccountsSelectors.getDetailsByAccountCode(state, accountCode),
		jurisdiction: bankAccountsSelectors.getJurisdictionsByCountryCode(state, countryCode),
		isLoading: bankAccountsSelectors.getLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			authenticated
		),
		kycRequirements: kycSelectors.selectRequirementsForTemplate(
			state,
			'incorporations',
			templateId
		),
		wallet: walletSelectors.getWallet(state),
		country: incorporationsSelectors.getCountry(state, countryCode)
	};
};

const styledComponent = withStyles(styles)(BankAccountsDetailContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsDetailContainer };
