// import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { pricesSelectors } from 'common/prices';
import { kycSelectors } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import { identitySelectors } from 'common/identity';
import { RESIDENCY_ATTRIBUTE } from 'common/identity/constants';
import { MarketplaceNotariesComponent } from '../common/marketplace-notaries-component';

const styles = theme => ({});

class NotarizationOffersContainerComponent extends MarketplaceNotariesComponent {
	componentDidMount() {
		const { vendorId } = this.props;
		this.loadRelyingParty({ rp: vendorId, authenticated: false });
		this.props.dispatch(push(this.productRoute()));
	}

	render() {
		// TODO: future listing page
		return null;
	}
}

NotarizationOffersContainerComponent.propTypes = {
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
	const notaries = marketplaceSelectors.selectNotaries(state, identity.type);

	// Select US or international product
	const residencyAttribute = identitySelectors.selectAttributeValue(state, {
		identityId: identity.id,
		attributeTypeUrl: RESIDENCY_ATTRIBUTE
	});
	const residency = residencyAttribute && residencyAttribute.country === 'US' ? 'US' : 'INT';
	const product = notaries.find(n => n.data.jurisdiction === residency);

	if (product) {
		templateId = product.data.templateId;
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

const styledComponent = withStyles(styles)(NotarizationOffersContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as NotarizationOffersContainer };
