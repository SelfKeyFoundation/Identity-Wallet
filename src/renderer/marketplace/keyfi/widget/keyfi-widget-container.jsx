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
	componentDidMount() {
		if (this.props.active) {
			this.loadRelyingParty({ rp: 'keyfi', authenticated: false, forceUpdate: true });
		}
	}
	render() {
		return this.props.active ? (
			<KeyFiWidget
				onCredentialsClick={() => this.props.dispatch(push(`/main/marketplace/keyfi`))}
			/>
		) : null;
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
		active: product && product.status === 'active' && !application
	};
};

const styledComponent = withStyles(styles)(KeyFiWidgetContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as KeyFiWidgetContainer };
