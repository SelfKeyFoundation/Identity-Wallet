import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import StakingDashboardCard from './dashboard-card';
import { primary } from 'selfkey-ui';
import vaultImage from '../../../../static/assets/images/bgs/vault.png';

const useStyles = makeStyles({
	link: {
		cursor: 'pointer',
		color: primary,
		textDecoration: 'none',
		fontSize: 12
	},
	infoCardText: {
		fontSize: 12
	}
});

export const StakingDashboardInfoCard = () => {
	const classes = useStyles();

	return (
		<StakingDashboardCard title="About Staking" backgroundImage={{ img: vaultImage }}>
			<Grid container direction="column" spacing={2}>
				<Grid item>
					<Typography variant="h2">You can stake anytime you want!</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body2" color="secondary" className={classes.infoCardText}>
						LOCK airdrop - Basic Information about yourself. This can be edited at any
						time, but not deleted.
					</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body2" color="secondary" className={classes.infoCardText}>
						STAKING - Any information you provide is stored locally and encrypted
						on-chain. SelfKey is a non custodiary wallet and it doesn’t store your
						documets anywhere.
					</Typography>
				</Grid>
				<Grid item />
				<Grid item>
					<a className={classes.link}>Read more</a>
				</Grid>
			</Grid>
		</StakingDashboardCard>
	);
};

export default StakingDashboardInfoCard;
