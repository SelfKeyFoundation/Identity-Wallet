import React from 'react';
import { KycRequirementsList } from '../../kyc/requirements/requirements-list';

const MarketplaceKycRequirements = props => {
	const { requirements, templateId, title = 'KYC Requirements and Form' } = props;

	// No kyc-chain templateId is associated with this program
	// Hide the kyc requirements block
	if (!templateId) {
		return null;
	}
	// Requirements might take a while to load
	// Loading is done upstream and props are updated when loaded
	const loading = !requirements;

	return <KycRequirementsList requirements={requirements} loading={loading} title={title} />;
};

export { MarketplaceKycRequirements };
