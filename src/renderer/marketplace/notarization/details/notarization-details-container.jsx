import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { identitySelectors } from 'common/identity';
import { withStyles } from '@material-ui/core/styles';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceNotariesComponent } from '../common/marketplace-notaries-component';
import NotarizationDetailsPage from './notarization-details-page';
import { getCryptoValue } from '../../../common/price-utils';
import config from 'common/config';

const styles = theme => ({});

class NotarizationDetailsContainer extends MarketplaceNotariesComponent {
	state = {
		tab: 'types',
		loading: false
	};

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	onTabChange = tab => this.setState({ tab });

	onApplyClick = () => {
		const { rp, identity, vendorId } = this.props;
		const selfkeyIdRequiredRoute = '/main/marketplace/selfkey-id-required';
		const selfkeyDIDRequiredRoute = '/main/marketplace/selfkey-did-required';
		const requestNotarizationRoute = '/main/marketplace/notaries/process';
		const authenticated = true;

		this.setState({ loading: true }, async () => {
			if (!identity.isSetupFinished) {
				return this.props.dispatch(push(selfkeyIdRequiredRoute));
			}
			if (!identity.did) {
				return this.props.dispatch(push(selfkeyDIDRequiredRoute));
			} else {
				await this.props.dispatch(push(requestNotarizationRoute));
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
		const { keyRate, kycRequirements, templateId } = this.props;
		return (
			<NotarizationDetailsPage
				onBackClick={this.onBackClick}
				keyRate={keyRate}
				loading={this.state.loading || this.props.isLoading}
				tab={this.state.tab}
				kycRequirements={kycRequirements}
				templateId={templateId}
				onTabChange={this.onTabChange}
				startNotarize={this.onApplyClick}
			/>
		);
	}
}

NotarizationDetailsContainer.propTypes = {
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = async (state, props) => {
	const { templateId, vendorId } = props.match.params;
	const authenticated = true;
	let primaryToken = {
		...props,
		cryptoCurrency: config.constants.primaryToken
	};
	return {
		templateId,
		vendorId,
		// isLoading: marketplaceSelectors.isLoading(state),
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			vendorId,
			authenticated
		),
		kycRequirements: kycSelectors.selectRequirementsForTemplate(state, vendorId, templateId),
		identity: identitySelectors.selectIdentity(state),
		cryptoValue: getCryptoValue(state, primaryToken)
	};
};

const styledComponent = withStyles(styles)(NotarizationDetailsContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as NotarizationDetailsContainer };
