import React from 'react';
import { withStyles, Tabs, Tab } from '@material-ui/core';
import { NotarizationTypesTab } from './details-types-tab';
import { NotarizationKeyTab } from './details-key-tab';

const styles = theme => ({});

export const NotarizationDetailsPageTabs = withStyles(styles)(
	({ classes, tab = 'types', onTabChange, ...tabProps }) => {
		return (
			<React.Fragment>
				<Tabs value={tab} onChange={(evt, value) => onTabChange(value)}>
					<Tab id="typesButton" value="types" label="Supported Document Types" />
					<Tab id="informationsButton" value="informations" label="Key Informations" />
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
