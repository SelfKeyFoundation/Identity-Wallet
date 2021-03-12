import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { WhatYouGetTab } from '../../common/what-you-get-tab';

const styles = theme => ({});

export const PassportsDetailsTabs = withStyles(styles)(
	({ classes, tab = 'whatyouget', onTabChange, ...tabProps }) => {
		return (
			<React.Fragment>
				<Tabs value={tab} onChange={(evt, value) => onTabChange(value)}>
					<Tab id="whatYouGetButton" value="whatyouget" label="WHAT YOU GET" />
					<Tab id="descriptionButton" value="description" label="Description" />
					<Tab id="legalButton" value="legal" label="Legal" />
					<Tab id="taxesButton" value="taxes" label="Taxes" />
					<Tab id="countryButton" value="country" label="Country Details" />
					<Tab id="taxTreatiesButton" value="taxTreaties" label="Tax Treaties" />
					<Tab id="servicesButton" value="services" label="Services" />
				</Tabs>
				{tab === 'whatyouget' && <WhatYouGetTab id="whatyouget" {...tabProps} />}
			</React.Fragment>
		);
	}
);

export default PassportsDetailsTabs;
