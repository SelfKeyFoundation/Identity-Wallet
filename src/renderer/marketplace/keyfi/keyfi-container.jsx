// import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { pricesSelectors } from 'common/prices';
import { kycSelectors } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import { identitySelectors } from 'common/identity';
// import { RESIDENCY_ATTRIBUTE } from 'common/identity/constants';
import { MarketplaceKeyFiComponent } from './common/marketplace-keyfi-component';

const styles = theme => ({});

class MarketplaceKeyFiContainerComponent extends MarketplaceKeyFiComponent {
	async componentDidMount() {
		const { vendorId } = this.props;
		await this.loadRelyingParty({ rp: vendorId, authenticated: false });
		this.props.dispatch(push(this.checkoutRoute()));
	}

	render = () => null;
}

MarketplaceKeyFiContainerComponent.propTypes = {
	templateId: PropTypes.string,
	vendorId: PropTypes.string,
	rpShouldUpdate: PropTypes.bool
};

const mapStateToProps = (state, props) => {
	const authenticated = true;
	let templateId = null;
	let vendorId = null;
	let productId = null;

	const identity = identitySelectors.selectIdentity(state);
	const product = marketplaceSelectors.selectInventoryItemBySku(
		state,
		'keyfi_kyc',
		identity.type
	);

	// Redirect to error page if Residency US ?
	/*
	// Select US or international product
	const residencyAttribute = identitySelectors.selectAttributeValue(state, {
		identityId: identity.id,
		attributeTypeUrl: RESIDENCY_ATTRIBUTE
	});
	const residency = residencyAttribute && residencyAttribute.country === 'US' ? 'US' : 'INT';

	if (residencyAttribute && residencyAttribute.country === 'US') {
	}
	*/

	if (product) {
		templateId = product.relyingPartyConfig.templateId;
		vendorId = product.vendorId;
		productId = product.sku;
	}

	return {
		identity,
		templateId,
		vendorId,
		productId,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			vendorId,
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(MarketplaceKeyFiContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as MarketplaceKeyFiContainer };
