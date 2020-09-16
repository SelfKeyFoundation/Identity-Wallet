import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { identitySelectors } from 'common/identity';
import { StakingDashboardPage } from './dashboard-page';
import { RegisterDidCardContainer, DisplayDid } from '../../did';
import KycCardContainer from '../../kyc/kyc-card/kyc-card-container';

class StakingDashboardContainerComponent extends PureComponent {
	render() {
		const { identity } = this.props;
		return (
			<StakingDashboardPage
				{...this.props}
				didComponent={
					identity.did ? (
						<DisplayDid did={identity.did} />
					) : (
						<RegisterDidCardContainer returnPath={'/main/staking'} />
					)
				}
				kycComponent={
					<KycCardContainer
						cancelRoute={'/main/staking'}
						nextRoute={'/main/staking'}
						vendorId="selfkey"
						sku="staking_kyc"
						applicationTitle="Airdrop"
						applicationDescription="You are about to begin the application process for Selfkey LOCK fAirdrop"
						applicationAgreement="conducting KYC"
					/>
				}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		identity: identitySelectors.selectIdentity(state)
	};
};

export const StakingDashboardContainer = connect(mapStateToProps)(
	StakingDashboardContainerComponent
);

export default StakingDashboardContainer;
