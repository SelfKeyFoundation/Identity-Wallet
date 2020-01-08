import React from 'react';
import { withStyles, Tabs, Tab } from '@material-ui/core';
import { CertifiersDashboardOverviewTab } from './dashboard-overview-container';
import { CertifiersDashboardAnalyticsTab } from './dashboard-analytics-container';
import { CertifiersDashboardHistoryTab } from './dashboard-history-container';

const styles = theme => ({});

export const DashboardPageTabs = withStyles(styles)(
	({ classes, tab, onTabChange, ...tabProps }) => {
		return (
			<React.Fragment>
				<Tabs value={tab} onChange={(evt, value) => onTabChange(value)}>
					<Tab id="overview" value="overview" label="Overview" />
					<Tab id="history" value="history" label="Requests History" />
					<Tab id="analytics" value="analytics" label="Analytics" />
				</Tabs>
				{tab === 'overview' && (
					<CertifiersDashboardOverviewTab id="overview" {...tabProps} />
				)}
				{tab === 'history' && <CertifiersDashboardHistoryTab id="history" {...tabProps} />}
				{tab === 'analytics' && (
					<CertifiersDashboardAnalyticsTab id="analytics" {...tabProps} />
				)}
			</React.Fragment>
		);
	}
);

export default DashboardPageTabs;
