import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { CorporateOverviewTab } from './overview-tab';
import { CorporateInformationTab } from './information-tab';
import { CorporateMembersTab } from './members-tab';
import { CorporateApplicationsTab } from './applications-tab';
import { CorporateHistoryTab } from './history-tab';

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

export const CorporateDashboardTabs = withStyles(styles)(
	({ classes, tab = 'overview', onTabChange, ...tabProps }) => {
		return (
			<div className={classes.dashboardTabs}>
				<Tabs
					value={tab}
					className={classes.tabs}
					onChange={(evt, value) => onTabChange(value)}
				>
					<Tab id="overview" value="overview" label="Overview" />
					<Tab id="information" value="information" label="Information & Documents" />
					<Tab id="members" value="members" label="Manage Members" />
					<Tab id="applications" value="applications" label="Applications" />
					<Tab id="history" value="history" label="History" disabled />
				</Tabs>
				{tab === 'overview' && <CorporateOverviewTab id="overviewTab" {...tabProps} />}
				{tab === 'information' && (
					<CorporateInformationTab id="informationTab" {...tabProps} />
				)}
				{tab === 'members' && <CorporateMembersTab id="membersTab" {...tabProps} />}
				{tab === 'applications' && (
					<CorporateApplicationsTab id="applicationsTab" {...tabProps} />
				)}
				{tab === 'history' && <CorporateHistoryTab id="historyTab" {...tabProps} />}
			</div>
		);
	}
);

export default CorporateDashboardTabs;
