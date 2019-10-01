import React from 'react';
import { Typography, Grid, withStyles } from '@material-ui/core';
import DashboardPageTabs from './dashboard-tabs';

const styles = theme => ({
	pageContent: {
		width: '1080px',
		margin: '0 auto'
	},
	'@media screen and (min-width: 1230px)': {
		pageContent: {
			width: '1140px'
		}
	},
	tabs: {
		padding: '20px 0 0 !important',
		marginBottom: '20px'
	},
	container: {
		width: '100%',
		margin: '0 auto',
		maxWidth: '1140px'
	}
});

export const CertifiersDashboard = withStyles(styles)(props => {
	const { classes, tab, onTabChange } = props;
	return (
		<Grid container>
			<Grid item>
				<Grid
					container
					direction="column"
					justify="flex-start"
					alignItems="stretch"
					className={classes.pageContent}
				>
					<Typography variant="h1">Certifiers Dashboard</Typography>
				</Grid>
				<Grid container>
					<Grid item className={classes.container}>
						<Grid item className={classes.tabs}>
							<DashboardPageTabs {...props} tab={tab} onTabChange={onTabChange} />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
});

export default CertifiersDashboard;
