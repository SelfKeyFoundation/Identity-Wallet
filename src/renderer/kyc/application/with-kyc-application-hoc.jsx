import React, { Component } from 'react';
import { connect } from 'react-redux';
import { inventorySelectors } from '../../../common/marketplace/inventory/index';
import { marketplaceSelectors } from '../../../common/marketplace';
import { kycSelectors } from '../../../common/kyc';

export function withKycApplication(WrappedComponent) {
	class WithKycApplication extends Component {
		render() {
			const { ...passThroughProps } = this.props;
			return <WrappedComponent {...passThroughProps} />;
		}
	}

	WithKycApplication.displayName = `WithKycApplication(${getDisplayName(WrappedComponent)})`;

	return connect(mapStateToProps)(WithKycApplication);
}

function getDisplayName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function mapStateToProps(state, props) {
	const { vendorId, itemId, sku } = props;
	let inventoryItem = null;

	if (itemId) {
		inventoryItem = inventorySelectors.selectInventoryItemById(state, itemId);
	} else {
		if (vendorId && sku) {
			inventoryItem = inventorySelectors.selectInventoryItemById(state, vendorId, sku);
		}
	}

	return {
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		inventoryItem,
		isLoading: marketplaceSelectors.isInventoryLoading(state)
	};
}
