import React from 'react';
import PropTypes from 'prop-types';
import { BigNumber } from 'bignumber.js';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { identitySelectors } from 'common/identity';
import { withStyles } from '@material-ui/core/styles';
import { BankingDetailsPage } from './details-page';
import { marketplaceSelectors } from 'common/marketplace';
import { getCryptoValue } from '../../../common/price-utils';
import config from 'common/config';

const styles = theme => ({});

class BankAccountsDetailContainer extends MarketplaceBankAccountsComponent {
	state = {
		tab: 'types',
		loading: false
	};

	async componentDidMount() {
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: false });
		window.scrollTo(0, 0);
	}

	onBackClick = () => this.props.dispatch(push(this.listRoute()));

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
		return new BigNumber(priceUSD).dividedBy(this.props.keyRate);
	};

	onApplyClick = () => {
		const { rp, identity, vendorId, jurisdiction } = this.props;
		const selfkeyIdRequiredRoute = '/main/marketplace/selfkey-id-required';
		const selfkeyDIDRequiredRoute = '/main/marketplace/selfkey-did-required';
		const keyPrice = this.priceInKEY(jurisdiction.price);
		const transactionNoKeyError = `/main/transaction-no-key-error/${keyPrice}`;
		const authenticated = true;
		const keyAvailable = new BigNumber(this.props.cryptoValue);
		// When clicking the start process,
		// we check if an authenticated kyc-chain session exists
		// If it doesn't we trigger a new authenticated rp session
		// and redirect to checkout route
		// The loading state is used to disable the button while data is being loaded
		this.setState({ loading: true }, async () => {
			if (keyPrice.gt(keyAvailable)) {
				return this.props.dispatch(push(transactionNoKeyError));
			}
			if (!identity.isSetupFinished) {
				return this.props.dispatch(push(selfkeyIdRequiredRoute));
			}
			if (!identity.did) {
				return this.props.dispatch(push(selfkeyDIDRequiredRoute));
			}
			if (!rp || !rp.authenticated) {
				await this.props.dispatch(
					kycOperations.loadRelyingParty(
						vendorId,
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

	buildResumeData = data => {
		const isPersonalVisitRequired = accounts => {
			return Object.keys(accounts).reduce((required, accountId) => {
				const account = accounts[accountId];
				return required && account.personalVisitRequired;
			}, true);
		};

		const maxFromCurrencyString = (accounts, field) => {
			return Object.keys(accounts).reduce((current, accountId) => {
				const account = accounts[accountId];
				const item = Number((account[field] || '0').replace(/[^0-9.-]+/g, ''));
				return current > item ? current : item;
			}, 0);
		};

		const timeToOpen = (accounts, field = 'timeToOpen') => {
			return Object.keys(accounts).reduce((current, accountId) => {
				const account = accounts[accountId];
				return current || account[field];
			}, '');
		};

		const creditCards = (accounts, field = 'cards') => {
			return Object.keys(accounts).reduce((current, accountId) => {
				const account = accounts[accountId];
				return current || (account[field] ? account[field].join(' ') : false);
			}, '');
		};

		return [
			[
				{
					name: 'Min. Initial Deposit',
					value: maxFromCurrencyString(data.accounts, 'minInitialDeposit'),
					highlighted: true
				},
				{
					name: 'Min. Monthly Balance',
					value: maxFromCurrencyString(data.accounts, 'minMonthlyBalance'),
					highlighted: true
				}
			],
			[
				{
					name: 'Personal Visit Required',
					value: isPersonalVisitRequired(data.accounts) ? 'Yes' : 'No',
					highlighted: true
				},
				{
					name: 'Time to open',
					value: timeToOpen(data.accounts),
					highlighted: true
				}
			],
			[
				{
					name: 'Cards',
					value: creditCards(data.accounts),
					highlighted: true
				}
			]
		];
	};

	render() {
		const { jurisdiction, keyRate, kycRequirements, country, templateId } = this.props;
		const { price } = jurisdiction;
		const { region } = jurisdiction.data;

		return (
			<BankingDetailsPage
				applicationStatus={this.getApplicationStatus()}
				loading={this.state.loading || this.props.isLoading}
				country={country}
				countryCode={country.code}
				price={price}
				tab={this.state.tab}
				onTabChange={this.onTabChange}
				keyRate={keyRate}
				region={region}
				jurisdiction={jurisdiction}
				banks={jurisdiction.data.accounts}
				resume={this.buildResumeData(jurisdiction.data)}
				canOpenBankAccount={this.canApply(price)}
				startApplication={this.onApplyClick}
				kycRequirements={kycRequirements}
				templateId={templateId}
				onBack={this.onBackClick}
				onStatusAction={this.onStatusActionClick}
			/>
		);
	}
}

BankAccountsDetailContainer.propTypes = {
	banks: PropTypes.object,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	const { accountCode, countryCode, templateId, vendorId } = props.match.params;
	const authenticated = true;
	let primaryToken = {
		...props,
		cryptoCurrency: config.constants.primaryToken
	};
	const identity = identitySelectors.selectIdentity(state);
	return {
		templateId,
		vendorId,
		jurisdiction: marketplaceSelectors.selectBankJurisdictionByAccountCode(
			state,
			accountCode,
			identity.type
		),
		country: marketplaceSelectors.selectCountryByCode(state, countryCode),
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			vendorId,
			authenticated
		),
		kycRequirements: kycSelectors.selectRequirementsForTemplate(state, vendorId, templateId),
		identity,
		cryptoValue: getCryptoValue(state, primaryToken)
	};
};

const styledComponent = withStyles(styles)(BankAccountsDetailContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsDetailContainer };
