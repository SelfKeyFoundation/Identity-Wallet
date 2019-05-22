import React from 'react';
import { withStyles, Tabs, Tab } from '@material-ui/core';
import { BankingTypesTab } from './details-types-tab';
import { BankingCountryTab } from './details-country-tab';
import { BankingDescriptionTab } from './details-description-tab';
import { BankingServicesTab } from './details-services-tab';

const styles = theme => ({});

export const BankingDetailsPageTabs = withStyles(styles)(
	({ classes, tab = 'types', onTabChange, ...tabProps }) => {
		return (
			<React.Fragment>
				<Tabs value={tab} onChange={(evt, value) => onTabChange(value)}>
					<Tab value="types" label="Account Types" />
					<Tab value="description" label="Description" />
					<Tab value="country" label="Country Details" />
					<Tab value="services" label="Services" />
				</Tabs>
				{tab === 'types' && <BankingTypesTab {...tabProps} />}
				{tab === 'country' && <BankingCountryTab {...tabProps} />}
				{tab === 'services' && <BankingServicesTab {...tabProps} />}
				{tab === 'description' && <BankingDescriptionTab {...tabProps} />}
			</React.Fragment>
		);
	}
);

export default BankingDetailsPageTabs;
