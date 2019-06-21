import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { incorporationsSelectors, incorporationsOperations } from 'common/incorporations';
import { kycSelectors, kycOperations } from 'common/kyc';
import { walletSelectors } from 'common/wallet';
import { pricesSelectors } from 'common/prices';
import { IncorporationDetailsPage } from './details-page';
import { getIncorporationPrice } from '../common';

import ReactPiwik from 'react-piwik';

const MARKETPLACE_INCORPORATION_ROOT_PATH = '/main/marketplace-incorporation';

class IncorporationsDetailView extends Component {
	state = {
		tab: 'description',
		loading: false
	};

	setEcommerceView = () => {
		const { program } = this.props;

		ReactPiwik.push([
			'setEcommerceView',
			program['Company code'],
			program.Region,
			'Incorporation',
			program['Wallet Price']
		]);
	};

	clearEcommerceCart = () => {
		ReactPiwik.push(['clearEcommerceCart']);
	};

	async componentDidMount() {
		window.scrollTo(0, 0);

		const { treaties, rpShouldUpdate } = this.props;
		const { countryCode } = this.props.match.params;
		const notAuthenticated = false;

		if (!treaties || !treaties.length) {
			this.props.dispatch(
				incorporationsOperations.loadIncorporationsTaxTreatiesOperation(countryCode)
			);
		}

		if (rpShouldUpdate) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty('incorporations', notAuthenticated)
			);
		}

		this.setEcommerceView();
	}

	componentWillUnmount() {
		this.clearEcommerceCart();
	}

	handleExternalLinks = e => {
		if (e.target && e.target.getAttribute('href')) {
			e.stopPropagation();
			e.preventDefault();
			window.openExternal(e, e.target.getAttribute('href'));
		}
	};

	onTabChange = tab => this.setState({ tab });

	onBackClick = () => this.props.dispatch(push(MARKETPLACE_INCORPORATION_ROOT_PATH));

	cancelRoute = () => {
		const { companyCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_INCORPORATION_ROOT_PATH}/details/${companyCode}/${countryCode}/${templateId}`;
	};

	payRoute = () => {
		const { countryCode, companyCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_INCORPORATION_ROOT_PATH}/pay/${companyCode}/${countryCode}/${templateId}`;
	};

	checkoutRoute = () => {
		const { countryCode, companyCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_INCORPORATION_ROOT_PATH}/checkout/${companyCode}/${countryCode}/${templateId}`;
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
						this.payRoute(),
						this.canIncorporate()
					)
				);
			} else {
				await this.props.dispatch(push(this.payRoute()));
			}
		});
	};

	onPayClick = () => {
		const { countryCode, companyCode, templateId } = this.props.match.params;

		this.props.dispatch(
			push(
				`/main/marketplace-incorporation/pay-confirmation/${companyCode}/${countryCode}/${templateId}`
			)
		);
	};

	getPrice = () => {
		const { program } = this.props;
		return getIncorporationPrice(program);
	};

	getLastApplication = () => {
		const { rp } = this.props;
		const { templateId } = this.props.match.params;
		// For easy kyc testing, use the following test templateId
		// const templateId = '5c6fadbf77c33d5c28718d7b';
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

	// Can only incorporate if:
	// - there is a valid price for this jurisdiction (from airtable)
	// - templateId exists for this jurisdiction (from airtable)
	// - user has not applied before or previous application was rejected
	canIncorporate = () => {
		const { templateId } = this.props.match.params;
		const price = this.getPrice();

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

	render() {
		const { keyRate, jurisdiction, requirements, country, program, treaties } = this.props;
		const { countryCode, templateId } = this.props.match.params;
		return (
			<IncorporationDetailsPage
				applicationStatus={this.getApplicationStatus()}
				loading={this.state.loading || this.props.isLoading}
				country={country}
				contact={'support@flagtheory.com'}
				countryCode={countryCode}
				price={this.getPrice()}
				tab={this.state.tab}
				onTabChange={this.onTabChange}
				keyRate={keyRate}
				jurisdiction={jurisdiction}
				canIncorporate={this.canIncorporate()}
				startApplication={this.onApplyClick}
				requirements={requirements}
				handleExternalLinks={this.handleExternalLinks}
				templateId={templateId}
				onBack={this.onBackClick}
				onStatusAction={this.onStatusActionClick}
				program={program}
				treaties={treaties}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { companyCode, countryCode, templateId } = props.match.params;
	const notAuthenticated = false;
	return {
		program: incorporationsSelectors.getIncorporationsDetails(state, companyCode),
		treaties: incorporationsSelectors.getTaxTreaties(state, countryCode),
		isLoading: incorporationsSelectors.getLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			notAuthenticated
		),
		requirements: kycSelectors.selectRequirementsForTemplate(
			state,
			'incorporations',
			templateId
		),
		wallet: walletSelectors.getWallet(state)
	};
};

export default connect(mapStateToProps)(IncorporationsDetailView);
