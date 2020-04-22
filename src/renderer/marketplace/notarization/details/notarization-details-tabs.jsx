import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { NotarizationTypesTab } from './notarization-details-types-tab';
import { NotarizationKeyTab } from './notarization-details-key-tab';

const styles = theme => ({});

export const NotarizationDetailsPageTabs = withStyles(styles)(
	({ classes, tab, onTabChange, ...tabProps }) => {
		return (
			<React.Fragment>
				<Tabs value={tab} onChange={(evt, value) => onTabChange(value)}>
					<Tab id="typesButton" value="types" label="Supported Document Types" />
					<Tab id="informationsButton" value="informations" label="Key Information" />
				</Tabs>
				{tab === 'types' && <NotarizationTypesTab id="accountTab" {...tabProps} />}
				{tab === 'informations' && (
					<NotarizationKeyTab id="informationsTab" {...tabProps} />
				)}
			</React.Fragment>
		);
	}
);

export default NotarizationDetailsPageTabs;
