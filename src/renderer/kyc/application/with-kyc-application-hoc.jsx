import React, { Component } from 'react';
import { connect } from 'react-redux';
import { inventorySelectors } from '../../../common/marketplace/inventory/index';
import { marketplaceSelectors } from '../../../common/marketplace';
import { kycSelectors } from '../../../common/kyc';
import {
	APPLICATION_REJECTED,
	APPLICATION_CANCELLED,
	APPLICATION_APPROVED,
	APPLICATION_ANSWER_REQUIRED
} from 'common/kyc/status_codes';

export function withKycApplication(WrappedComponent, config) {
	class WithKycApplication extends Component {
		async componentDidMount() {
			await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: false });
		}

		get applicationStatus() {
			const { rp } = this.props;
			if (!rp || !rp.authenticated) {
				return null;
			}

			const application = this.lastApplication;

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

			if (application.payments?.length) {
				return 'unpaid';
			}

			return 'progress';
		}

		get canApply() {
			const { rp, templateId } = this.props;
			if (!rp || !rp.authenticated) {
				const applicationStatus = this.applicationStatus;
				return templateId && (!applicationStatus || applicationStatus === 'rejected');
			}

			return !!templateId;
		}

		get lastApplication() {
			const { rp, templateId } = this.props;

			if (!rp || !rp.authenticated) return false;
			const { applications } = this.props.rp;
			if (!applications || applications.length === 0) return false;

			applications.sort((a, b) => {
				const aDate = new Date(a.createdAt);
				const bDate = new Date(b.createdAt);
				return aDate > bDate ? 1 : -1;
			});

			let application;
			let index = applications.length - 1;
			for (; index >= 0; index--) {
				if (applications[index].template === templateId) {
					application = applications[index];
					break;
				}
			}

			return application;
		}

		render() {
			const { ...passThroughProps } = this.props;
			return (
				<WrappedComponent
					{...passThroughProps}
					applicationStatus={this.applicationStatus}
					canApply={this.canApply}
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

	const rp = kycSelectors.relyingPartySelector(state, vendorId);

	if (itemId) {
		inventoryItem = inventorySelectors.selectInventoryItemById(state, itemId);
	} else {
		if (vendorId && sku) {
			inventoryItem = inventorySelectors.selectInventoryItemById(state, vendorId, sku);
		}
	}

	if (!templateId && inventoryItem) {
		templateId =
			inventoryItem.relyingPartyConfig?.templateId ||
			inventoryItem.data?.templateId ||
			rp.relyingPartyConfig?.templateId ||
			null;
	}

	if (templateId) {
		kycRequirements = kycSelectors.selectRequirementsForTemplate(state, vendorId, templateId);
	}

	return {
		rp,
		inventoryItem,
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		templateId,
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(state, vendorId, true),
		kycRequirements
	};
}
