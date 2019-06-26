import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { walletSelectors } from 'common/wallet';
import { withStyles } from '@material-ui/core/styles';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { BankingDetailsPage } from './details-page';
import { incorporationsOperations, incorporationsSelectors } from 'common/incorporations';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';

class BankAccountsDetailContainer extends Component {
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

	redirectRoute = () => {
		return null;
	};

	onBackClick = () => this.props.dispatch(push(MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH));

	onTabChange = tab => this.setState({ tab });

	onStatusActionClick = () => {
		if (this.props.rp && this.props.rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted()) return null;
			if (this.applicationWasRejected()) return null;
			if (this.applicationRequiresAdditionalDocuments()) {
				console.log('TODO: redirect to kyc-chain');
			}
			if (!this.userHasPaid()) {
				this.props.dispatch(push(this.payRoute()));
			}
		}
		return null;
	};

	getApplicationStatus = () => {
		if (this.props.rp && this.props.rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted()) return 'completed';
			if (this.applicationWasRejected()) return 'rejected';
			if (this.applicationRequiresAdditionalDocuments()) return 'progress';
			if (!this.userHasPaid()) return 'unpaid';

			return 'progress';
		}
		return null;
	};

	getLastApplication = () => {
		const { rp } = this.props;
		const { templateId } = this.props.match.params;

		if (!rp || !rp.authenticated) return false;

		const { applications } = this.props.rp;
		if (!applications || applications.length === 0) return false;

		let application;
		let index = applications.length - 1;
		for (; index >= 0; index--) {
			if (applications[index].template === templateId) {
				application = applications[index];
				break;
			}
		}
		return application;
	};

	userHasApplied = () => {
		const application = this.getLastApplication();
		return !!application;
	};

	userHasPaid = () => {
		const application = this.getLastApplication();
		if (!application || !application.payments) {
			return false;
		}
		return !!application.payments.length;
	};

	applicationWasRejected = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		// Process is cancelled or Process is rejected
		return application.currentStatus === 3 || application.currentStatus === 8;
	};

	applicationCompleted = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		return application.currentStatus === 2;
	};

	applicationRequiresAdditionalDocuments = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		return application.currentStatus === 9;
	};

	// Can only apply if:
	// - store data has loaded (isLoading prop)
	// - there is a valid price for this jurisdiction (from airtable)
	// - templateId exists for this jurisdiction (from airtable)
	// - user has not applied before or previous application was rejected
	canUserOpenBankAccount = () => {
		const { templateId } = this.props.match.params;
		const price = this.props.accountType.price;

		/*
		FIXME: removed temporarily for testing purposes (to allow more than one active application per template)
		if (this.props.rp && this.props.rp.authenticated) {
			return !!(
				templateId &&
				price &&
				(!this.userHasApplied() || this.applicationWasRejected())
			);
		} else {
			return !!(templateId && price);
		}
		*/
		return !!(templateId && price);
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
		return (
			<BankingDetailsPage
				applicationStatus={this.getApplicationStatus()}
				loading={this.state.loading || this.props.isLoading}
				accountType={accountType}
				country={country}
				countryCode={accountType.countryCode}
				price={accountType.price}
				tab={this.state.tab}
				onTabChange={this.onTabChange}
				keyRate={keyRate}
				region={accountType.region}
				banks={banks}
				resume={this.buildResumeData(banks)}
				jurisdiction={jurisdiction}
				canOpenBankAccount={this.canUserOpenBankAccount()}
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
