import React, { PureComponent } from 'react';
import { Typography, Grid, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SelfkeyLogo, LockLogo, success } from 'selfkey-ui';

import StakingDashboardInfoCard from './info-card';
import StakingDashboardCard from './dashboard-card';
import StakeKeyForm from './stake-key-form';
import WithdrawKeyForm from './withdraw-key-form';
import WithdrawRewardForm from './withdraw-reward-form';
import { PropTypes } from 'prop-types';

const styles = theme => ({
	container: {},
	title: {
		padding: theme.spacing(0)
	},
	header: {}
});
class StakingDashboardPage extends PureComponent {
	render() {
		const {
			classes,
			stakeInfo,
			keyToken,
			lockToken,
			onStake,
			onWithdrawStake,
			onWithdrawReward,
			onHelp
		} = this.props;
		return (
			<Grid
				id="stakingDashboard"
				container
				direction="column"
				justify="flex-start"
				alignItems="stretch"
				spacing={4}
				className={classes.container}
			>
				<Grid item id="header" className={classes.header}>
					<Typography variant="h1" className={classes.title}>
						Staking Dashboard
					</Typography>
				</Grid>
				<Grid item>
					<Divider />
				</Grid>
				<Grid item>
					<Grid container direction="row" justify="space-between" spacing={1}>
						<Grid item>
							<StakingDashboardCard
								token={keyToken}
								balance={keyToken.balance}
								title="Total KEY balance"
								icon={<SelfkeyLogo width={29} height={33} />}
							>
								<StakeKeyForm
									stakeInfo={stakeInfo}
									keyToken={keyToken}
									onSubmit={onStake}
								/>
							</StakingDashboardCard>
						</Grid>
						<Grid item>
							<StakingDashboardCard
								token={keyToken}
								balance={stakeInfo.stakeBalance}
								title="Total KEY staked"
								icon={<SelfkeyLogo width={29} height={33} />}
							>
								<WithdrawKeyForm stakeInfo={stakeInfo} onSubmit={onWithdrawStake} />
							</StakingDashboardCard>
						</Grid>
						<Grid item>
							<StakingDashboardCard
								token={lockToken}
								balance={stakeInfo.rewardBalance}
								title="Reward LOCK"
								icon={<LockLogo width={29} height={33} />}
								accentColor={success}
							>
								<WithdrawRewardForm
									stakeInfo={stakeInfo}
									onSubmit={onWithdrawReward}
								/>
							</StakingDashboardCard>
						</Grid>
						<Grid item>
							<StakingDashboardInfoCard onHelp={onHelp} />
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Divider />
				</Grid>
			</Grid>
		);
	}
}

const styledComponent = withStyles(styles)(StakingDashboardPage);
export { styledComponent as StakingDashboardPage };

StakingDashboardPage.propTypes = {
	stakeInfo: PropTypes.object,
	keyToken: PropTypes.object,
	lockToken: PropTypes.object,
	onStake: PropTypes.func,
	onWithdrawReward: PropTypes.func,
	onWithdrawStake: PropTypes.func,
	onHelp: PropTypes.func
};
