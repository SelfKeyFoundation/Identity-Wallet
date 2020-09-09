import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { identitySelectors } from 'common/identity';
import { StakingDashboardPage } from './dashboard-page';
import { RegisterDidCardContainer } from '../../did';
import KycCardContainer from '../../kyc/kyc-card-container';

class StakingDashboardContainerComponent extends PureComponent {
	render() {
		return (
			<StakingDashboardPage
				{...this.props}
				didComponent={<RegisterDidCardContainer returnPath={'/main/staking'} />}
				kycComponent={<KycCardContainer returnPath={'/main/staking'} />}
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
