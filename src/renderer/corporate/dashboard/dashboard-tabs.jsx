import React from 'react';
import { withStyles, Tabs, Tab } from '@material-ui/core';
import { CorporateOverviewTab } from './overview-tab';
import { CorporateInformationTab } from './information-tab';
import { CorporateMembersTab } from './members-tab';
import { CorporateApplicationsTab } from './applications-tab';
import { CorporateHistoryTab } from './history-tab';

const styles = theme => ({});

export const CorporateDashboardTabs = withStyles(styles)(
	({ classes, tab = 'overview', onTabChange, ...tabProps }) => {
		return (
			<React.Fragment>
				<Tabs value={tab} onChange={(evt, value) => onTabChange(value)}>
					<Tab id="overview" value="overview" label="Overview" />
					<Tab id="information" value="information" label="Informations & Documents" />
					<Tab id="members" value="members" label="Manage Members" />
					<Tab id="applications" value="applications" label="Applications" />
					<Tab id="history" value="history" label="History" />
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
			</React.Fragment>
		);
	}
);

export default CorporateDashboardTabs;
