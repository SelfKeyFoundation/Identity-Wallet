import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { IndividualOverviewTab } from './overview-tab';
import { IndividualApplicationsTab } from './applications-tab';

const styles = theme => ({
	dashboardTabs: {
		alignItems: 'stretch',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start'
	},
	tabs: {
		marginBottom: '40px'
	}
});

export const IndividualDashboardTabs = withStyles(styles)(
	({ classes, tab = 'overview', onTabChange, ...tabProps }) => (
		<div className={classes.dashboardTabs}>
			<Tabs
				value={tab}
				className={classes.tabs}
				onChange={(evt, value) => onTabChange(value)}
			>
				<Tab id="overview" value="overview" label="Overview" />
				<Tab id="applications" value="applications" label="Marketplace Applications" />

				{/* <Tab label="Companies" /> */}
				{/* <Tab label="History" /> */}
			</Tabs>
			{tab === 'overview' && <IndividualOverviewTab id="overviewTab" {...tabProps} />}
			{tab === 'applications' && (
				<IndividualApplicationsTab id="applicationsTab" {...tabProps} />
			)}
		</div>
	)
);

export default IndividualDashboardTabs;
