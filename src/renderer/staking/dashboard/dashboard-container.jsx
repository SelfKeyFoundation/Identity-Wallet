import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { stakingOperations, stakingSelectors } from '../../../common/staking';
import { StakingDashboardPage } from './dashboard-page';
import config from 'common/config';
import { getTokenBySymbol } from '../../../common/wallet-tokens/selectors';

class StakingDashboardContainerComponent extends PureComponent {
	componentDidMount() {
		this.props.dispatch(stakingOperations.fetchStakeOperation());
	}
	handleWithdrawStake = opt => {
		console.log('XXX', 'withdraw stake', opt);
	};
	handleWithdrawReward = opt => {
		console.log('XXX', 'withdraw reward', opt);
	};
	handleHelp = () => {
		console.log('XXX', 'help');
	};
	handleStake = opt => {
		console.log('XXX', 'stake', opt);
	};
	render() {
		return (
			<StakingDashboardPage
				{...this.props}
				onStake={this.handleStake}
				onWithdrawStake={this.handleWithdrawStake}
				onWithdrawReward={this.handleWithdrawReward}
				onHelp={this.handleHelp}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		keyToken: getTokenBySymbol(state, config.constants.primaryToken),
		lockToken: { symbol: 'LOCK', decimal: 18, balance: '19' },
		stakeInfo: stakingSelectors.selectStakingInfo(state)
	};
};

export const StakingDashboardContainer = connect(mapStateToProps)(
	StakingDashboardContainerComponent
);

export default StakingDashboardContainer;
