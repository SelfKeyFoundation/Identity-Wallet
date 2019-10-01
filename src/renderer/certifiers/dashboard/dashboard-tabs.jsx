import React from 'react';
import { withStyles, Tabs, Tab } from '@material-ui/core';
import { CertifiersDashboardOverviewTab } from './dashboard-overview';
import { CertifiersDashboardMessagesTab } from './dashboard-messages';
import { CertifiersDashboardHistoryTab } from './dashboard-history';

const styles = theme => ({});

export const DashboardPageTabs = withStyles(styles)(
	({ classes, tab = 'overview', onTabChange, ...tabProps }) => {
		return (
			<React.Fragment>
				<Tabs value={tab} onChange={(evt, value) => onTabChange(value)}>
					<Tab id="overview" value="overview" label="Overview" />
					<Tab id="messages" value="messages" label="Messages" />
					<Tab id="history" value="history" label="Requests History" />
				</Tabs>
				{tab === 'overview' && (
					<CertifiersDashboardOverviewTab id="overview" {...tabProps} />
				)}
				{tab === 'messages' && (
					<CertifiersDashboardMessagesTab id="messages" {...tabProps} />
				)}
				{tab === 'history' && <CertifiersDashboardHistoryTab id="history" {...tabProps} />}
			</React.Fragment>
		);
	}
);

export default DashboardPageTabs;
