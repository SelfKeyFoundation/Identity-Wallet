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

class NotarizationDetailsContainerComponent extends MarketplaceNotariesComponent {
	state = {
		tab: 'types',
		loading: false
	};

	componentDidMount() {
		const { vendorId } = this.props;
		this.loadRelyingParty({ rp: vendorId, authenticated: false });
	}

	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	onTabChange = tab => this.setState({ tab });

	onApplyClick = () => {
		const { rp, identity, vendorId } = this.props;
		const selfkeyIdRequiredRoute = '/main/marketplace/selfkey-id-required';
		const selfkeyDIDRequiredRoute = '/main/marketplace/selfkey-did-required';
		const requestNotarizationRoute = '/main/marketplace/notaries/process';
		const authenticated = true;

		const { rp, identity, vendorId, dispatch } = this.props;
		const authenticated = true;

		this.setState({ loading: true }, async () => {
			if (!identity.isSetupFinished) {
				return dispatch(push(this.selfkeyIdRequiredRoute()));
			}
			if (!identity.did) {
				return dispatch(push(this.selfkeyDIDRequiredRoute()));
			}

			if (!rp || !rp.authenticated) {
				await dispatch(
					kycOperations.loadRelyingParty(
						vendorId,
						authenticated,
						this.checkoutRoute(),
						this.cancelRoute()
					)
				);
			} else {
				await dispatch(push(this.checkoutRoute()));
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
		const { keyRate, kycRequirements, templateId, product } = this.props;
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
				product={product}
			/>
		);
	}
}

NotarizationDetailsContainerComponent.propTypes = {
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number,
	templateId: PropTypes.string,
	vendorId: PropTypes.string
};

const mapStateToProps = (state, props) => {
	const { templateId, vendorId, productId } = props.match.params;
	const authenticated = true;

	const primaryToken = {
		...props,
		cryptoCurrency: config.constants.primaryToken
	};
	const identity = identitySelectors.selectIdentity(state);

	return {
		templateId,
		vendorId,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		productId,
		product: marketplaceSelectors.selectInventoryItemByFilter(
			state,
			'notaries',
			p => p.sku === productId,
			identity.type
		),
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

const styledComponent = withStyles(styles)(NotarizationDetailsContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as NotarizationDetailsContainer };
