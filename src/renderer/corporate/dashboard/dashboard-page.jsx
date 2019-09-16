import React from 'react';
import { Typography, Grid, withStyles } from '@material-ui/core';
import { CorporateDashboardTabs } from './dashboard-tabs';

const styles = theme => ({
	container: {
		width: '100%',
		margin: '50px auto 0',
		maxWidth: '960px'
	},
	title: {
		padding: '22px 0'
	},
	contentContainer: {
		borderBottom: '1px solid #303C49'
	}
});
export const CorporateDashboardPage = withStyles(styles)(props => {
	const { classes, tab, onTabChange } = props;
	return (
		<Grid
			id="corpWalletDashboard"
			container
			direction="column"
			justify="flex-start"
			alignItems="stretch"
			className={classes.container}
		>
			<Grid item id="header">
				<Typography variant="h1" className={classes.title}>
					SelfKey Corporate Vault
				</Typography>
			</Grid>
			<Grid container className={classes.contentContainer}>
				<CorporateDashboardTabs {...props} tab={tab} onTabChange={onTabChange} />
			</Grid>
		</Grid>
	);
});

export default CorporateDashboardPage;
