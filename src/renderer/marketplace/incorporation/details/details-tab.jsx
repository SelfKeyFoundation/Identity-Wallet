import React from 'react';
import TabsContainer from '../../common/tabs-container';
import LegalViewTab from './legal-view-tab';
import TaxViewTab from './tax-view-tab';
import DescriptionTab from './description-tab';
import CountryDetailsTab from './country-details-tab';
import ServicesTab from './services-tab';
import TaxTreaties from './tax-treaties-tab';

/**
 * This tab configuration could be reused on ReactNative implemenation
 */
const tabs = [
	{
		id: 'description',
		label: 'Description',
		className: 'description',
		component: DescriptionTab
	},
	{
		id: 'legal',
		label: 'Legal',
		disabled: ({ program }) => !program.details,
		className: 'legal',
		component: LegalViewTab
	},
	{
		id: 'tax',
		label: 'Taxes',
		disabled: ({ program }) => !program.tax,
		className: 'taxes',
		component: TaxViewTab
	},
	{
		id: 'countryDetails',
		label: 'Country Details',
		disabled: ({ program }) => !program.translation,
		className: 'country-details',
		component: CountryDetailsTab
	},
	{
		id: 'taxTreaties',
		label: 'Tax Treaties',
		disabled: ({ treaties }) => !treaties,
		className: 'tax-treaties',
		component: TaxTreaties
	},
	{
		id: 'services',
		label: 'Services',
		className: 'Services',
		component: ServicesTab
	}
];

const DetailsTabs = props => <TabsContainer tabs={tabs} {...props} />;

export default DetailsTabs;
