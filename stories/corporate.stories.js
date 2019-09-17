import React from 'react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';

import { CorporateDashboardPage } from '../src/renderer/corporate';
import { CorporateDashboardTabs } from '../src/renderer/corporate/dashboard/dashboard-tabs';
import { CorporateDetails } from '../src/renderer/corporate/common/corporate-details';
import { CorporateApplicationsSummary } from '../src/renderer/corporate/common/corporate-applications';
import { CorporateCapTable } from '../src/renderer/corporate/common/corporate-cap-table';
import { CorporateShareholding } from '../src/renderer/corporate/common/corporate-shareholding';
import { CorporateWizard } from '../src/renderer/corporate/wizard/corporate-wizard';

import { corporateApplications, corporateCapTable, dummyMembers } from './corporate-data';

storiesOf('Corporate', module).add('Dashboard', () => (
	<div style={{ width: '1140px' }}>
		<CorporateDashboardPage />
	</div>
));

storiesOf('Corporate/Dashboard Tabs', module)
	.add('default', () => (
		<CorporateDashboardTabs onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)} />
	))
	.add('overview', () => (
		<CorporateDashboardTabs
			tab="overview"
			onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)}
		/>
	))
	.add('information', () => (
		<CorporateDashboardTabs
			tab="information"
			onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)}
		/>
	))
	.add('members', () => (
		<CorporateDashboardTabs
			tab="members"
			onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)}
		/>
	))
	.add('applications', () => (
		<CorporateDashboardTabs
			tab="applications"
			onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)}
		/>
	))
	.add('history', () => (
		<CorporateDashboardTabs
			tab="history"
			onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)}
		/>
	));

storiesOf('Corporate/Blocks', module)
	.add('Company', () => (
		<CorporateDetails
			name="Company Name"
			jurisdiction="United States"
			type="LLC"
			date="08/08/2018"
			address="Address"
			onEdit={action('corporate details edit click')}
		/>
	))
	.add('Company with missing attributes', () => (
		<CorporateDetails
			name="Company Name"
			type="LLC"
			date="08/08/2018"
			onEdit={action('corporate details edit click')}
		/>
	))
	.add('Corporate Applications', () => (
		<CorporateApplicationsSummary applications={corporateApplications} />
	))
	.add('Corporate Cap Table', () => (
		<CorporateCapTable cap={corporateCapTable} onEdit={action('corporate cap edit click')} />
	))
	.add('Corporate Shareholding', () => <CorporateShareholding cap={corporateCapTable} />);

storiesOf('Corporate', module).add('Wizard', () => <CorporateWizard members={dummyMembers} />);