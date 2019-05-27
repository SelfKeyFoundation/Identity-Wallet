import React from 'react';
import { KycRequirementsList } from '../../kyc/requirements/requirements-list';

const MarketplaceKycRequirements = props => {
	const { requirements, templateId } = props;

	// No kyc-chain templateId is associated with this program
	// Hide the kyc requirements block
	if (!templateId) {
		return null;
	}
	// Requirements might take a while to load
	// Loading is done upstream and props are updated when loaded
	const loading = !requirements;

	return (
		<KycRequirementsList
			requirements={requirements}
			loading={loading}
			title="KYC Requirements and Forms"
		/>
	);
};

export default MarketplaceKycRequirements;
