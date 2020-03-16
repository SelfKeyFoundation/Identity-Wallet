// import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { kycSelectors } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import { identitySelectors } from 'common/identity';

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
	const templateId = '5dd3acee96884e657768eac4';
	const vendorId = 'selfkey_certifier';

	const identity = identitySelectors.selectIdentity(state);
	const profile = identitySelectors.selectIndividualProfile(state);
	const notaries = marketplaceSelectors.selectNotaries(state, identity.type);

	// Find country from identitiy attributes
	// Select US or international product
	const countryAttribute = profile.allAttributes.find(
		attr =>
			attr.type.content.$id ===
			'http://platform.selfkey.org/schema/attribute/nationality.json'
	);
	const nationality = countryAttribute ? countryAttribute.data.value.country : '';
	const productId = nationality === 'US' ? notaries[0].sku : notaries[1].sku;

	return {
		templateId,
		vendorId,
		productId,
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
