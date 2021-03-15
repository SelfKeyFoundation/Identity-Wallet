import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { WhatYouGetTab } from '../../common/what-you-get-tab';
import { PassportsDescriptionTab } from './passports-description-tab';
import { PassportsRequirementsTab } from './passports-requirements-tab';
import { PassportsProceduresTab } from './passports-procedures-tab';
import { PassportsBenefitsTab } from './passports-benefits-tab';
import { PassportsTaxesTab } from './passports-taxes-tab';
import { PassportsCountryTab } from './passports-country-tab';

const styles = theme => ({});

export const PassportsDetailsTabs = withStyles(styles)(
	({ classes, tab = 'whatyouget', onTabChange, ...tabProps }) => {
		return (
			<React.Fragment>
				<Tabs value={tab} onChange={(evt, value) => onTabChange(value)}>
					<Tab id="descriptionButton" value="description" label="Description" />
					<Tab id="requirementsButton" value="requirements" label="Requirements" />
					<Tab id="proceduresButton" value="procedures" label="Procedures" />
					<Tab id="benefitsButton" value="benefits" label="Benefits" />
					<Tab id="countryButton" value="country" label="Country Details" />
					{/* <Tab id="visaFreeButton" value="visaFree" label="Visa Free" /> */}
					<Tab id="taxesButton" value="taxes" label="Taxes" />
				</Tabs>
				{tab === 'whatyouget' && <WhatYouGetTab id="whatyouget" {...tabProps} />}
				{tab === 'description' && (
					<PassportsDescriptionTab id="requirementsTab" {...tabProps} />
				)}

				{tab === 'requirements' && (
					<PassportsRequirementsTab id="requirementsTab" {...tabProps} />
				)}
				{tab === 'procedures' && (
					<PassportsProceduresTab id="proceduresTab" {...tabProps} />
				)}
				{tab === 'benefits' && <PassportsBenefitsTab id="benefitsTab" {...tabProps} />}
				{tab === 'country' && <PassportsCountryTab id="benefitsTab" {...tabProps} />}
				{tab === 'taxes' && <PassportsTaxesTab id="benefitsTab" {...tabProps} />}
			</React.Fragment>
		);
	}
);

export default PassportsDetailsTabs;
