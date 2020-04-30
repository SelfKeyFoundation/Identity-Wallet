import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { MarketplaceIncorporationsComponent } from '../common/marketplace-incorporations-component';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { identitySelectors } from 'common/identity';
import { withStyles } from '@material-ui/styles';
import { marketplaceSelectors } from 'common/marketplace';
import { IncorporationsDetailsPage } from './incorporations-details-page';

const styles = theme => ({});

class IncorporationsDetailsContainer extends MarketplaceIncorporationsComponent {
	state = {
		tab: 'whatyouget',
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
					name: 'Offshore Tax',
					value: data.offshoreIncomeTaxRate,
					highlighted: true
				},
				{
					name: 'Dividends Received',
					value: data.dividendsReceived,
					highlighted: true
				}
			],
			[
				{
					name: 'Corp Income',
					value: data.corporateTaxRate,
					highlighted: true
				},
				{
					name: 'Dividends paid',
					value: data.dividendsWithholdingTaxRate,
					highlighted: true
				}
			],
			[
				{
					name: 'Capital Gains',
					value: data.capitalGainsTaxRate,
					highlighted: true
				},
				{
					name: 'Royalties paid',
					value: data.royaltiesWithholdingTaxRate,
					highlighted: true
				}
			],
			[
				{
					name: 'Interests paid',
					value: data.interestsWithholdingTaxRate,
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

	render() {
		const {
			program,
			keyRate,
			kycRequirements,
			country,
			treaties,
			templateId,
			countryCode
		} = this.props;
		const region = program.data.region;
		const price = program.price;
		const description = program.data.walletDescription
			? program.data.walletDescription
			: program.data.servicesDescription;
		return (
			<IncorporationsDetailsPage
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
				region={region}
				canIncorporate={this.canApply(price)}
				startApplication={this.onApplyClick}
				kycRequirements={kycRequirements}
				templateId={templateId}
				onBack={this.onBackClick}
				onStatusAction={this.onStatusActionClick}
				description={description}
				timeToForm={program.data.timeToFormWeeks}
				whatYouGet={program.whatYouGet}
				initialDocsText={`You will be required to provide a few basic information about yourself like full name and email. This will be done through SelfKey ID Wallet.`}
				kycProcessText={`You will undergo a standard KYC process and our team will get in touch with you to make sure we have all the information needed.`}
				getFinalDocsText={`Once the account opening process is done you will receive all the relevant documents, access codes in persion/via courier or on your email.`}
			/>
		);
	}
}

IncorporationsDetailsContainer.propTypes = {
	program: PropTypes.object,
	treaties: PropTypes.object,
	country: PropTypes.object,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	const { companyCode, countryCode, templateId, vendorId } = props.match.params;
	const notAuthenticated = false;
	return {
		companyCode,
		countryCode,
		templateId,
		vendorId,
		program: marketplaceSelectors.selectIncorporationByFilter(
			state,
			c => c.data.companyCode === companyCode
		),
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
		memberKycRequirements: kycSelectors.selectMemberRequirementsForTemplate(
			state,
			vendorId,
			templateId
		),
		identity: identitySelectors.selectIdentity(state)
	};
};

const styledComponent = withStyles(styles)(IncorporationsDetailsContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as IncorporationsDetailsContainer };
