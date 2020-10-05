import React, { PureComponent } from 'react';
import { Typography, Grid, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SelfkeyLogo, LockLogo, success } from 'selfkey-ui';

import StakingDashboardInfoCard from './info-card';
import StakingDashboardCard from './dashboard-card';
import StakeKeyForm from './stake-key-form';
import WithdrawKeyForm from './withdraw-key-form';
import WithdrawRewardForm from './withdraw-reward-form';

const styles = theme => ({
	container: {},
	title: {
		padding: '0'
	},
	header: {}
});
class StakingDashboardPage extends PureComponent {
	render() {
		const { classes } = this.props;
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
					<Grid container direction="row" justify="center" spacing={4}>
						<Grid item>
							<StakingDashboardCard
								token={{ symbol: 'KEY', decimal: 18 }}
								balance="160000000000"
								title="Total KEY balance"
								icon={<SelfkeyLogo width={29} height={33} />}
							>
								<StakeKeyForm />
							</StakingDashboardCard>
						</Grid>
						<Grid item>
							<StakingDashboardCard
								token={{ symbol: 'KEY', decimal: 18 }}
								balance="8000"
								title="Total KEY staked"
								icon={<SelfkeyLogo width={29} height={33} />}
							>
								<WithdrawKeyForm />
							</StakingDashboardCard>
						</Grid>
						<Grid item>
							<StakingDashboardCard
								token={{ symbol: 'LOCK', decimal: 18 }}
								balance="16"
								title="Reward LOCK"
								icon={<LockLogo width={29} height={33} />}
								accentColor={success}
							>
								<WithdrawRewardForm />
							</StakingDashboardCard>
						</Grid>
						<Grid item>
							<StakingDashboardInfoCard />
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
