import React from 'react';
import { Typography, Grid, withStyles } from '@material-ui/core';
import { CorporateDashboardTabs } from './dashboard-tabs';

const styles = theme => ({
	title: {
		padding: '0 0 22px 0'
	},
	contentContainer: {
		borderBottom: '1px solid #303C49'
	}
});
export const CorporateDashboardPage = withStyles(styles)(props => {
	const { classes, tab, onTabChange } = props;
	return (
		<React.Fragment>
			<Grid container item direction="row" justify="flex-start" alignItems="flex-start">
				<Typography variant="h1" className={classes.title}>
					SelfKey Corporate Vault
				</Typography>
			</Grid>
			<Grid container className={classes.contentContainer}>
				<CorporateDashboardTabs {...props} tab={tab} onTabChange={onTabChange} />
			</Grid>
		</React.Fragment>
	);
});

export default CorporateDashboardPage;
