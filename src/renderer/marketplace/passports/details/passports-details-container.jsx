import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { identitySelectors } from 'common/identity';
import { withStyles } from '@material-ui/styles';
import { marketplaceSelectors } from 'common/marketplace';
import { PassportsDetailsPage } from './passports-details-page';
import { featureIsEnabled } from 'common/feature-flags';
import { MarketplacePassportsComponent } from '../common/marketplace-passports-component';

const styles = theme => ({});

class PassportsDetailsContainerComponent extends MarketplacePassportsComponent {
	state = {
		tab: 'description',
		loading: false
	};

	async componentDidMount() {
		this.loadRelyingParty({ rp: this.props.vendorId, authenticated: false });
		window.scrollTo(0, 0);
	}

	onBackClick = () => this.props.dispatch(push(this.rootPath()));

	onTabChange = tab => this.setState({ tab });

	buildResumeData = data => {
		return [
			[
				{
					name: 'Dual Citizenship',
					value: data.dualCitizenship ? data.dualCitizenship : 'No',
					highlighted: true
				},
				{
					name: 'Personal Visit',
					value: data.personalVisitRequired ? data.personalVisitRequired : 'No',
					highlighted: true
				}
			],
			[
				{
					name: 'Interview Required',
					value: data.interviewRequired ? data.interviewRequired : 'No',
					highlighted: true
				},
				{
					name: 'Visa Free Travel',
					value: data.visaFree,
					highlighted: true
				}
			],
			[
				{
					name: 'Min Income',
					value: data.minimumAnnualIncome,
					highlighted: true
				},
				{
					name: 'Years to Citizenship',
					value: data.timeToCitizenship,
					highlighted: true
				}
			],
			[
				{
					name: 'Investment Single',
					value: data.investmentAmountSingleApplicant,
					highlighted: true
				},
				{
					name: 'Investment Family',
					value: data.investmentAmount4MemberFamily,
					highlighted: true
				}
			]
		];
	};

	// Status bar component allows for an action button on the right
	// This handler processes the action for that button
	onStatusActionClick = () => {
		const { rp } = this.props;
		if (rp && rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted() || this.applicationWasRejected()) {
				this.props.dispatch(push(this.manageApplicationsRoute()));
			} else if (!this.userHasPaid()) {
				this.props.dispatch(push(this.payRoute()));
			} else if (this.applicationRequiresAdditionalDocuments()) {
				this.redirectToKYCC(rp);
			}
		}
		return null;
	};

	onApplyClick = () => {
		const { rp, identity, vendorId } = this.props;
		const selfkeyIdRequiredRoute = '/main/marketplace/selfkey-id-required';
		const selfkeyDIDRequiredRoute = '/main/marketplace/selfkey-did-required';
		const authenticated = true;
		// When clicking the start process, we check:
		// 1 - If wallet setup is finished
		// 2 - If DID exists
		// 3 - if an authenticated kyc-chain session exists
		//     If it doesn't we trigger a new authenticated rp session
		//     and redirect to checkout route
		// The loading state is used to disable the button while data is being loaded
		this.setState({ loading: true }, async () => {
			if (!identity.isSetupFinished) {
				return this.props.dispatch(push(selfkeyIdRequiredRoute));
			}
			if (featureIsEnabled('did') && !identity.did) {
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

	render() {
		const {
			program,
			keyRate,
			kycRequirements,
			treaties,
			templateId,
			countryCode,
			country
		} = this.props;
		const { price } = program;
		/*
		const description = program.data.walletDescription
			? program.data.walletDescription
			: program.data.servicesDescription;
		*/
		const description = '';

		return (
			<PassportsDetailsPage
				applicationStatus={this.getApplicationStatus()}
				loading={this.state.loading || this.props.isLoading}
				program={program}
				country={country}
				countryCode={countryCode}
				treaties={treaties}
				price={price}
				tab={this.state.tab}
				resume={this.buildResumeData(program.data)}
				onTabChange={this.onTabChange}
				keyRate={keyRate}
				canApply={this.canApply(price)}
				startApplication={this.onApplyClick}
				kycRequirements={kycRequirements}
				templateId={templateId}
				onBack={this.onBackClick}
				onStatusAction={this.onStatusActionClick}
				description={description}
				timeToForm={'0'}
				whatYouGet={''}
				initialDocsText={`You will be required to provide a few basic information about yourself like full name and email. This will be done through SelfKey ID Wallet.`}
				kycProcessText={`You will undergo a standard KYC process and our team will get in touch with you to make sure we have all the information needed.`}
				getFinalDocsText={`Once the process is done you will receive all the relevant documents on your email.`}
			/>
		);
	}
}

PassportsDetailsContainerComponent.propTypes = {
	program: PropTypes.object,
	treaties: PropTypes.object,
	country: PropTypes.object,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	const { programCode, countryCode, templateId, vendorId } = props.match.params;
	const notAuthenticated = false;
	const program = marketplaceSelectors.selectPassportsByFilter(
		state,
		c => c.data.programCode === programCode
	);
	return {
		programCode,
		countryCode,
		templateId,
		vendorId,
		program,
		treaties: marketplaceSelectors.selectTaxTreatiesByCountryCode(state, countryCode),
		country: marketplaceSelectors.selectCountryByCode(state, countryCode),
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			vendorId,
			notAuthenticated
		),
		kycRequirements: kycSelectors.selectRequirementsForTemplate(state, vendorId, templateId),
		identity: identitySelectors.selectIdentity(state)
	};
};

const styledComponent = withStyles(styles)(PassportsDetailsContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as PassportsDetailsContainer };
