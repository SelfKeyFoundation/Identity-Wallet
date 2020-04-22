import React from 'react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';

import { RegisterDidCard } from '../src/renderer/did/register-did-card';

import { IndividualDashboardPage } from '../src/renderer/individual/dashboard/dashboard-page';
import { IndividualDashboardTabs } from '../src/renderer/individual/dashboard/dashboard-tabs';
import { IndividualOverviewTab } from '../src/renderer/individual/dashboard/overview-tab';
import { IndividualApplicationsTab } from '../src/renderer/individual/dashboard/applications-tab';
import { AttributesTable } from '../src/renderer/individual/common/attributes-table';
import { DocumentsTable } from '../src/renderer/individual/common/documents-table';

import { dummyProfile, dummyProfileWithoutDid } from './__fixtures__/individual-data';

storiesOf('Individual Profile', module).add('Dashboard', () => (
	<div style={{ width: '1140px' }}>
		<IndividualDashboardPage />
	</div>
));

storiesOf('Individual Profile/Dashboard Tabs', module)
	.add('default', () => (
		<IndividualDashboardTabs
			profile={dummyProfile}
			didComponent={
				<RegisterDidCard
					onRegisterDidClick={action('register did click')}
					onAssociateDidClick={action('associate did click')}
				/>
			}
			onMarketplaceClick={action('on marketplace')}
			onAvatarClick={action('on profile picture')}
			onEditAttribute={action('on edit attribute')}
			onDeleteAttribute={action('on delete attribute')}
			onAddAttribute={action('on add attribute')}
			onAddDocument={action('on add document')}
			onTabChange={linkTo('Individual Identity/Dashboard Tabs', tab => tab)}
		/>
	))
	.add('overview', () => (
		<IndividualDashboardTabs
			tab="overview"
			profile={dummyProfile}
			didComponent={
				<RegisterDidCard
					onRegisterDidClick={action('register did click')}
					onAssociateDidClick={action('associate did click')}
				/>
			}
			onMarketplaceClick={action('on marketplace')}
			onAvatarClick={action('on profile picture')}
			onEditAttribute={action('on edit attribute')}
			onDeleteAttribute={action('on delete attribute')}
			onAddAttribute={action('on add attribute')}
			onAddDocument={action('on add document')}
			onTabChange={linkTo('Individual Identity/Dashboard Tabs', tab => tab)}
		/>
	))
	.add('applications', () => (
		<IndividualDashboardTabs
			tab="applications"
			profile={dummyProfile}
			didComponent={
				<RegisterDidCard
					onRegisterDidClick={action('register did click')}
					onAssociateDidClick={action('associate did click')}
				/>
			}
			onMarketplaceClick={action('on marketplace')}
			onAvatarClick={action('on profile picture')}
			onEditAttribute={action('on edit attribute')}
			onDeleteAttribute={action('on delete attribute')}
			onAddAttribute={action('on add attribute')}
			onAddDocument={action('on add document')}
			onTabChange={linkTo('Individual Identity/Dashboard Tabs', tab => tab)}
		/>
	))

	.add('overview tab', () => (
		<IndividualOverviewTab
			profile={dummyProfile}
			onMarketplaceClick={action('on marketplace')}
			onAvatarClick={action('on profile picture')}
			onEditAttribute={action('on edit attribute')}
			onDeleteAttribute={action('on delete attribute')}
			onAddAttribute={action('on add attribute')}
			onAddDocument={action('on add document')}
		/>
	))
	.add('overview tab without DID', () => (
		<IndividualOverviewTab
			profile={dummyProfileWithoutDid}
			didComponent={
				<RegisterDidCard
					onRegisterDidClick={action('register did click')}
					onAssociateDidClick={action('associate did click')}
				/>
			}
			onMarketplaceClick={action('on marketplace')}
			onAvatarClick={action('on profile picture')}
			onEditAttribute={action('on edit attribute')}
			onDeleteAttribute={action('on delete attribute')}
			onAddAttribute={action('on add attribute')}
			onAddDocument={action('on add document')}
		/>
	))
	.add('applications tab', () => <IndividualApplicationsTab applications={[]} />)
	.add('empty applications tab', () => <IndividualApplicationsTab />);

storiesOf('Individual Profile/Components', module)
	.add('Documents Table', () => (
		<DocumentsTable
			documents={dummyProfile.documents}
			onEditAttribute={action('on edit attribute')}
			onDeleteAttribute={action('on delete attribute')}
		/>
	))
	.add('Attributes Table', () => (
		<AttributesTable
			attributes={dummyProfile.allAttributes}
			onEditAttribute={action('on edit attribute')}
			onDeleteAttribute={action('on delete attribute')}
		/>
	));
