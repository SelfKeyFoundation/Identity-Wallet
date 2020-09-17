import React, { Component } from 'react';
import { connect } from 'react-redux';
import { inventorySelectors } from '../../../common/marketplace/inventory/index';
import { marketplaceSelectors } from '../../../common/marketplace';
import { kycSelectors, kycOperations } from '../../../common/kyc';
import {
	APPLICATION_REJECTED,
	APPLICATION_CANCELLED,
	APPLICATION_APPROVED,
	APPLICATION_ANSWER_REQUIRED
} from 'common/kyc/status_codes';
import { identitySelectors } from '../../../common/identity';

export function withKycApplication(WrappedComponent, config) {
	class WithKycApplication extends Component {
		async componentDidMount() {
			if (this.props.rpShouldUpdate) {
				await this.props.dispatch(
					kycOperations.loadRelyingParty(this.props.vendorId, false)
				);
			}
		}

		get applicationStatus() {
			const application = this.props.lastApplication;

			if (!application) return null;

			switch (application.currentStatus) {
				case APPLICATION_APPROVED:
					return 'completed';
				case APPLICATION_REJECTED:
				case APPLICATION_CANCELLED:
					return 'rejected';
				case APPLICATION_ANSWER_REQUIRED:
					return 'additionalRequirements';
			}

			if (application.payments && application.payments.length) {
				return 'unpaid';
			}

			return 'progress';
		}

		refreshApplication() {
			this.props.dispatch(
				kycOperations.refreshRelyingPartyForKycApplication(
					this.props.lastApplication,
					'/main/staking',
					'/main/staking'
				)
			);
		}

		render() {
			const { ...passThroughProps } = this.props;
			return (
				<WrappedComponent
					{...passThroughProps}
					applicationStatus={this.applicationStatus}
				/>
			);
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
	let { templateId } = props;
	let inventoryItem = null;
	let kycRequirements = null;
	const identity = identitySelectors.selectIdentity(state);
	const rp = kycSelectors.relyingPartySelector(state, vendorId);

	if (itemId) {
		inventoryItem = inventorySelectors.selectInventoryItemById(state, itemId);
	} else {
		if (vendorId && sku) {
			inventoryItem = inventorySelectors.selectInventoryItemByVendorSku(
				state,
				vendorId,
				sku,
				identity.type
			);
		}
	}

	if (!templateId && inventoryItem) {
		templateId =
			(inventoryItem.relyingPartyConfig && inventoryItem.relyingPartyConfig.templateId) ||
			(inventoryItem.data && inventoryItem.data.templateId) ||
			(rp && rp.relyingPartyConfig && rp.relyingPartyConfig.templateId) ||
			null;
	}

	if (templateId) {
		kycRequirements = kycSelectors.selectRequirementsForTemplate(state, vendorId, templateId);
	}

	return {
		rp,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		lastApplication: kycSelectors.selectLastApplication(
			state,
			vendorId,
			templateId,
			identity.id
		),
		inventoryItem,
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		templateId,
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(state, vendorId, true),
		kycRequirements
	};
}
