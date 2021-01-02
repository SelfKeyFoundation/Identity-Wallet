import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { kycSelectors } from 'common/kyc';
import { identitySelectors } from 'common/identity';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceKeyFiComponent } from '../common/marketplace-keyfi-component';
import { KeyFiWidget } from './keyfi-widget';

const styles = theme => ({});

class KeyFiWidgetContainerComponent extends MarketplaceKeyFiComponent {
	render() {
		return this.props.active ? null : (
			<KeyFiWidget
				onCredentialsClick={() => this.props.dispatch(push(`/main/marketplace/keyfi`))}
			/>
		);
	}
}

KeyFiWidgetContainerComponent.propTypes = {
	active: PropTypes.bool
};

const mapStateToProps = (state, props) => {
	const identity = identitySelectors.selectIdentity(state);
	const application = kycSelectors.selectApplications(state).find(app => app.rpName === 'keyfi');
	const product = marketplaceSelectors.selectInventoryItemBySku(
		state,
		'keyfi_kyc',
		identity.type
	);
	return {
		active: product.status === 'inactive' && !application
	};
};

const styledComponent = withStyles(styles)(KeyFiWidgetContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as KeyFiWidgetContainer };
