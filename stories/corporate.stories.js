import React from 'react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';

import { RegisterDidCard } from '../src/renderer/did/register-did-card';

import { CorporateDashboardPage } from '../src/renderer/corporate/dashboard/dashboard-page';
import { CorporateDashboardTabs } from '../src/renderer/corporate/dashboard/dashboard-tabs';
import { CorporateDetails } from '../src/renderer/corporate/common/corporate-details';
import { CorporateApplicationsSummary } from '../src/renderer/corporate/common/corporate-applications';
import { CorporateCapTable } from '../src/renderer/corporate/common/corporate-cap-table';
import { CorporateShareholding } from '../src/renderer/corporate/common/corporate-shareholding';
import { CorporateOrgChart } from '../src/renderer/corporate/common/corporate-org-chart';
import { CorporateInformation } from '../src/renderer/corporate/common/corporate-information';
import { CorporateWizard } from '../src/renderer/corporate/wizard/corporate-wizard';
import { CorporateAddMember } from '../src/renderer/corporate/member/corporate-add-member';
import { CorporateDocuments } from '../src/renderer/corporate/common/corporate-documents';
import { CorporateMembers } from '../src/renderer/corporate/common/corporate-members';

import {
	dummyProfile,
	dummyIncompleteProfile,
	corporateApplications,
	corporateCapTable,
	dummyMembers,
	entityTypes,
	legalJurisdictions,
	corporateAttributes,
	corporateDocuments,
	corporateMembers
} from './corporate-data';

storiesOf('Corporate', module).add('Dashboard', () => (
	<div style={{ width: '1140px' }}>
		<CorporateDashboardPage
			profile={dummyProfile}
			cap={corporateCapTable}
			applications={corporateApplications}
		/>
	</div>
));

storiesOf('Corporate/Dashboard Tabs', module)
	.add('default', () => (
		<CorporateDashboardTabs
			profile={dummyProfile}
			cap={corporateCapTable}
			applications={corporateApplications}
			onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)}
		/>
	))
	.add('overview', () => (
		<CorporateDashboardTabs
			tab="overview"
			profile={dummyProfile}
			cap={corporateCapTable}
			applications={corporateApplications}
			onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)}
		/>
	))
	.add('overview with incomplete profile', () => (
		<CorporateDashboardTabs
			tab="overview"
			profile={dummyIncompleteProfile}
			cap={corporateCapTable}
			applications={corporateApplications}
			didComponent={
				<RegisterDidCard
					onRegisterDidClick={action('register did click')}
					onAssociateDidClick={action('associate did click')}
				/>
			}
			onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)}
		/>
	))
	.add('information', () => (
		<CorporateDashboardTabs
			tab="information"
			profile={dummyProfile}
			cap={corporateCapTable}
			applications={corporateApplications}
			onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)}
			attributes={corporateAttributes}
			onEditAttribute={action('on edit attribute')}
			onDeleteAttribute={action('on delete attribute')}
			onAddAttribute={action('on add attribute')}
			documents={corporateDocuments}
			onAddDocument={action('on add document')}
			onEditDocument={action('on edit document')}
			onDeleteDocument={action('on delete document')}
		/>
	))
	.add('members', () => (
		<CorporateDashboardTabs
			tab="members"
			profile={dummyProfile}
			cap={corporateCapTable}
			applications={corporateApplications}
			onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)}
		/>
	))
	.add('applications', () => (
		<CorporateDashboardTabs
			tab="applications"
			profile={dummyProfile}
			cap={corporateCapTable}
			applications={corporateApplications}
			onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)}
		/>
	))
	.add('history', () => (
		<CorporateDashboardTabs
			tab="history"
			profile={dummyProfile}
			cap={corporateCapTable}
			applications={corporateApplications}
			onTabChange={linkTo('Corporate/Dashboard Tabs', tab => tab)}
		/>
	));

storiesOf('Corporate/Components', module)
	.add('Company', () => (
		<div style={{ width: '650px' }}>
			<CorporateDetails
				profile={dummyProfile}
				onEdit={action('corporate details edit click')}
			/>
		</div>
	))
	.add('Company with missing attributes', () => (
		<div style={{ width: '650px' }}>
			<CorporateDetails
				profile={dummyIncompleteProfile}
				onEdit={action('corporate details edit click')}
			/>
		</div>
	))
	.add('Corporate Applications', () => (
		<div style={{ width: '650px' }}>
			<CorporateApplicationsSummary applications={corporateApplications} />
		</div>
	))
	.add('Corporate Cap Table', () => (
		<div style={{ width: '650px' }}>
			<CorporateCapTable
				cap={corporateCapTable}
				onEdit={action('corporate cap edit click')}
			/>
		</div>
	))
	.add('Corporate Shareholding', () => (
		<div style={{ width: '650px' }}>
			<CorporateShareholding members={corporateMembers} />
		</div>
	))
	.add('Corporate Org Chart', () => (
		<div style={{ width: '650px' }}>
			<CorporateOrgChart
				profile={dummyProfile}
				cap={corporateCapTable}
				onEdit={action('corporate org chart edit click')}
			/>
		</div>
	))
	.add('Corporate Informations', () => (
		<div style={{ width: '1024px' }}>
			<CorporateInformation
				attributes={corporateAttributes}
				onEditAttribute={action('on edit attribute')}
				onDeleteAttribute={action('on delete attribute')}
				onAddAttribute={action('on add attribute')}
			/>
		</div>
	))
	.add('Corporate Documents', () => (
		<div style={{ width: '1024px' }}>
			<CorporateDocuments
				documents={corporateDocuments}
				onAddDocument={action('on add document')}
				onEditDocument={action('on edit document')}
				onDeleteDocument={action('on delete document')}
			/>
		</div>
	))
	.add('Corporate Members', () => (
		<div>
			<CorporateMembers
				members={corporateMembers}
				onOpenEntityDetails={action('on open entity details')}
				onAddMember={action('on add new member')}
				onDeleteMember={action('on delete member')}
				onEditMember={action('on edit member')}
			/>
		</div>
	))
	.add('Corporate Members with Selected Entity', () => (
		<div>
			<CorporateMembers
				members={corporateMembers}
				onOpenEntityDetails={action('on open entity details')}
				onAddMember={action('on add new member')}
				onDeleteMember={action('on delete member')}
				onEditMember={action('on edit member')}
				selectedEntity={corporateMembers[1]}
			/>
		</div>
	));

storiesOf('Corporate/Wizard', module)
	.add('default', () => (
		<CorporateWizard
			members={dummyMembers}
			entityTypes={entityTypes}
			jurisdictions={legalJurisdictions}
			onFieldChange={name => action(`field change ${name}:`)}
		/>
	))
	.add('field error', () => (
		<CorporateWizard
			members={dummyMembers}
			entityTypes={entityTypes}
			jurisdictions={legalJurisdictions}
			creationDate="2019-09-10"
			email="hello"
			entityName="hello"
			jurisdiction="Barbados"
			errors={{ email: 'email issue' }}
			onFieldChange={name => action(`field change ${name}:`)}
		/>
	));

storiesOf('Corporate', module).add('Add Member', () => <CorporateAddMember />);
