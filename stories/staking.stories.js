import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { text, object } from '@storybook/addon-knobs';
import { StakingDashboardPage } from '../src/renderer/staking/dashboard/dashboard-page';
import { StakingDashboardCard } from '../src/renderer/staking/dashboard/dashboard-card';
import { SelfkeyLogo } from 'selfkey-ui';
import StakingDashboardInfoCard from '../src/renderer/staking/dashboard/info-card';
import { TimelockPeriod } from '../src/renderer/staking/dashboard/timelock-period';
import { text, boolean, date } from '@storybook/addon-knobs';

const getStakingProps = () => {
	const keyToken = { symbol: 'KEY', decimal: 18, balance: text('KEY Balance', '16000000') };
	const lockToken = { symbol: 'LOCK', decimal: 18, balance: text('LOCK Balance', '19') };
	const stakeInfo = {
		stakeBalance: text('Stake Balance', '80000'),
		rewardBalance: text('Reward Balance', '50000'),
		timelockStart: date('Timelock Start TS', new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)),
		timelockEnd: date('Timelock end Date', new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)),
		canStake: boolean('Can Stake', true),
		canWithdrawStake: boolean('Can Withdraw Stake', true),
		canWithdrawReward: boolean('Can Withdraw Reward', true),
		hasStaked: boolean('Has staked', true),
		minStakeDate: date('Minimim stake date', new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)),
		minStakeAmount: text('Minimum stake amount', '10000')
	};
	return { keyToken, lockToken, stakeInfo };
};

storiesOf('Staking/Dashboard/DashboardCard', module)
	.add('default', () => {
		const { keyToken } = getStakingProps();
		return (
			<StakingDashboardCard
				token={keyToken}
				balance={keyToken.balance}
				title="Total KEY Balance"
				icon={<SelfkeyLogo width={29} height={33} />}
			>
				Hello
			</StakingDashboardCard>
		);
	})
	.add('info', () => <StakingDashboardInfoCard />);

storiesOf('Staking/Dashboard/TimelockPeriod', module)
	.add('in progress', () => (
		<TimelockPeriod
			startTs={new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)}
			endTs={new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)}
			hasStaked
		/>
	))
	.add('not staked', () => <TimelockPeriod hasStaked={false} />)
	.add('complete', () => (
		<TimelockPeriod
			startTs={new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)}
			endTs={new Date(Date.now() - 1000 * 60 * 60 * 24)}
			hasStaked
		/>
	));

storiesOf('Staking/Dashboard/Page', module).add('default', () => (
	<StakingDashboardPage
		{...getStakingProps()}
		onStake={action('stake')}
		onWithdrawStake={action('withdraw stake')}
		onWithdrawReward={action('withdraw reward')}
		onHelp={action('help')}
	/>
));
