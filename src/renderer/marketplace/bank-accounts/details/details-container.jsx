import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { MarketplaceComponent } from '../../common/marketplace-component';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { walletSelectors } from 'common/wallet';
import { withStyles } from '@material-ui/core/styles';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { BankingDetailsPage } from './details-page';
import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';

class BankAccountsDetailContainer extends MarketplaceComponent {
	state = {
		tab: 'types',
		loading: false
	};

	async componentDidMount() {
		const { rpShouldUpdate, accountType, country } = this.props;
		const notAuthenticated = false;

		if (!accountType) {
			await this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}

		if (rpShouldUpdate) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty('incorporations', notAuthenticated)
			);
		}

		if (!country) {
			this.props.dispatch(
				incorporationsOperations.loadIncorporationsCountryOperation(
					this.props.match.params.countryCode
				)
			);
		}
	}

	cancelRoute = () => {
		const { countryCode, accountCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/details/${accountCode}/${countryCode}/${templateId}`;
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

	onStatusActionClick = () => {
		const { rp } = this.props;
		if (rp && rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted()) return null;
			if (this.applicationWasRejected()) return null;
			if (this.applicationRequiresAdditionalDocuments()) {
				this.redirectToKYCC(rp);
			}
			if (!this.userHasPaid()) {
				this.props.dispatch(push(this.payRoute()));
			}
		}
		return null;
	};

	onApplyClick = () => {
		const { rp, wallet } = this.props;
		const selfkeyIdRequiredRoute = '/main/marketplace-selfkey-id-required';
		const authenticated = true;

		// When clicking the start incorporations, we check if an authenticated kyc-chain session exists
		// If it doesn't we trigger a new authenticated rp session and redirect to checkout route
		this.setState({ loading: true }, async () => {
			if (!wallet.isSetupFinished) {
				return this.props.dispatch(push(selfkeyIdRequiredRoute));
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
			/>
		);
	}
}

BankAccountsDetailContainer.propTypes = {
	bankAccount: PropTypes.object,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	const { accountCode, countryCode, templateId } = props.match.params;
	const notAuthenticated = false;

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
			notAuthenticated
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
