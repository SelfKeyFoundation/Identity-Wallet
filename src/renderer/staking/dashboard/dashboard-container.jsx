import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { StakingDashboardPage } from './dashboard-page';

class StakingDashboardContainerComponent extends PureComponent {
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
		keyToken: { symbol: 'KEY', decimal: 18, balance: '16000000' },
		lockToken: { symbol: 'LOCK', decimal: 18, balance: '19' },
		stakeInfo: {
			stakeBalance: '80000',
			rewardBalance: '50000',
			timelockStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
			timelockEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			canStake: true,
			canWithdrawStake: true,
			canWithdrawReward: true,
			hasStaked: true,
			minStakeDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			minStakeAmount: '10000'
		}
	};
};

export const StakingDashboardContainer = connect(mapStateToProps)(
	StakingDashboardContainerComponent
);

export default StakingDashboardContainer;
