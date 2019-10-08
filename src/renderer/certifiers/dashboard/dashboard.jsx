import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import DashboardPageTabs from './dashboard-tabs';

const styles = theme => ({
	pageContent: {
		width: '1080px',
		margin: '0 auto'
	},
	'@media screen and (min-width: 1230px)': {
		pageContent: {
			maxWidth: '1140px',
			width: '1140px'
		}
	},
	tabs: {
		padding: '20px 0 0 !important',
		marginBottom: '20px'
	}
});

export const CertifiersDashboard = withStyles(styles)(props => {
	const { classes, tab, onTabChange } = props;
	return (
		<div className={classes.pageContent}>
			<Typography variant="h1">Certifiers Dashboard</Typography>
			<div className={classes.tabs}>
				<DashboardPageTabs {...props} tab={tab} onTabChange={onTabChange} />
			</div>
		</div>
	);
});

export default CertifiersDashboard;
