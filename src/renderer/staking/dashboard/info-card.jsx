import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import StakingDashboardCard from './dashboard-card';
import vaultImage from '../../../../static/assets/images/bgs/vault.png';
import { primary } from 'selfkey-ui';

const useStyles = makeStyles({
	action: {
		height: 50,
		lineHeight: '30px'
	},
	infoCardText: {
		fontSize: 12
	},
	container: {
		height: '100%'
	},
	link: {
		cursor: 'pointer',
		color: primary,
		textDecoration: 'none',
		fontSize: 12
	}
});

export const StakingDashboardInfoCard = () => {
	const classes = useStyles();

	return (
		<StakingDashboardCard title="About Staking" backgroundImage={{ img: vaultImage }}>
			<Grid container direction="column" spacing={2} className={classes.container}>
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
				<Grid item xs />
				<Grid item className={classes.action}>
					<a className={classes.link}>Read more</a>
				</Grid>
			</Grid>
		</StakingDashboardCard>
	);
};

export default StakingDashboardInfoCard;
