import React from 'react';
import PropTypes from 'prop-types';
import { BigNumber } from 'bignumber.js';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { MarketplaceIncorporationsComponent } from '../common/marketplace-incorporations-component';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { identitySelectors } from 'common/identity';
import { withStyles } from '@material-ui/core/styles';
import { incorporationsSelectors, incorporationsOperations } from 'common/incorporations';
import { IncorporationsDetailsPage } from './incorporations-details-page';
import { getCryptoValue } from '../../../common/price-utils';
import config from 'common/config';

const styles = theme => ({});

class IncorporationsDetailsContainer extends MarketplaceIncorporationsComponent {
	state = {
		tab: 'description',
		loading: false
	};

	async componentDidMount() {
		const { program } = this.props;

		if (!program) {
			this.props.dispatch(incorporationsOperations.loadIncorporationsOperation());
		}

		this.loadRelyingParty({ rp: 'incorporations', authenticated: false });

		this.loadTreaties();

		this.loadCountry();

		window.scrollTo(0, 0);
	}

	onBackClick = () => this.props.dispatch(push(this.rootPath()));

	onTabChange = tab => this.setState({ tab });

	buildResumeData = tax => {
		return [
			[
				{
					name: 'Offshore Tax',
					value: tax['Offshore Income Tax Rate'],
					highlighted: true
				},
				{
					name: 'Dividends Received',
					value: tax['Dividends Received'],
					highlighted: true
				}
			],
			[
				{
					name: 'Corp Income',
					value: tax['Corporate Tax Rate'],
					highlighted: true
				},
				{
					name: 'Dividends paid',
					value: tax['Dividends Withholding Tax Rate'],
					highlighted: true
				}
			],
			[
				{
					name: 'Capital Gains',
					value: tax['Capital Gains Tax Rate'],
					highlighted: true
				},
				{
					name: 'Royalties paid',
					value: tax['Royalties Withholding Tax Rate'],
					highlighted: true
				}
			],
			[
				{
					name: 'Interests paid',
					value: tax['Interests Withholding Tax Rate'],
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

	priceInKEY = priceUSD => {
		return new BigNumber(priceUSD).dividedBy(this.props.keyRate);
	};

	onApplyClick = () => {
		const { rp, identity, program } = this.props;
		const selfkeyIdRequiredRoute = '/main/marketplace-selfkey-id-required';
		const selfkeyDIDRequiredRoute = '/main/marketplace-selfkey-did-required';
		const transactionNoKeyError = '/main/transaction-no-key-error';
		const authenticated = true;
		const keyPrice = this.priceInKEY(program.price);
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

	render() {
		const { program, keyRate, kycRequirements, country, treaties } = this.props;
		const { templateId } = this.props.match.params;
		const countryCode = program['Country code'];
		const region = program['Region'];
		const price = program.price;
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
				resume={this.buildResumeData(program.tax)}
				onTabChange={this.onTabChange}
				keyRate={keyRate}
				region={region}
				canIncorporate={this.canApply(price)}
				startApplication={this.onApplyClick}
				kycRequirements={kycRequirements}
				templateId={templateId}
				onBack={this.onBackClick}
				onStatusAction={this.onStatusActionClick}
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
	const { companyCode, countryCode, templateId } = props.match.params;
	const notAuthenticated = false;
	let primaryToken = {
		...props,
		cryptoCurrency: config.constants.primaryToken
	};
	return {
		program: incorporationsSelectors.getIncorporationsDetails(state, companyCode),
		treaties: incorporationsSelectors.getTaxTreaties(state, countryCode),
		country: incorporationsSelectors.getCountry(state, countryCode),
		isLoading: incorporationsSelectors.getLoading(state),
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
		identity: identitySelectors.selectCurrentIdentity(state),
		cryptoValue: getCryptoValue(state, primaryToken)
	};
};

const styledComponent = withStyles(styles)(IncorporationsDetailsContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as IncorporationsDetailsContainer };
