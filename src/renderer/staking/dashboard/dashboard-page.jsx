import React, { PureComponent } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	container: {
		width: '100%'
	},
	title: {
		padding: '0'
	},
	header: {
		marginBottom: '45px'
	}
});
class StakingDashboardPage extends PureComponent {
	render() {
		const { classes, didComponent, kycComponent, identity } = this.props;
		return (
			<Grid
				id="individualWalletDashboard"
				container
				direction="column"
				justify="flex-start"
				alignItems="stretch"
				className={classes.container}
			>
				<Grid item id="header" className={classes.header}>
					<Typography variant="h1" className={classes.title}>
						Staking
					</Typography>
				</Grid>
				<Grid item className={classes.contentContainer}>
					<Grid container direction="column" spacing={4}>
						{!identity.isSetupFinished ? (
							<Grid item>Please complete your profile</Grid>
						) : null}
						{didComponent ? <Grid item>{didComponent}</Grid> : null}
						{kycComponent ? <Grid item>{kycComponent}</Grid> : null}
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

const styledComponent = withStyles(styles)(StakingDashboardPage);
export { styledComponent as StakingDashboardPage };
