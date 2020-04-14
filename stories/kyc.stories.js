import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { KycRequirementsList } from '../src/renderer/kyc/requirements/requirements-list';
import { ApplicationStatusBar } from '../src/renderer/kyc/application/application-status';
import { CurrentApplicationPopup } from '../src/renderer/kyc/application/current-application-popup';
import KYCRequirementData from './__fixtures__/kyc-requirements-data';
import { relyingParty, individualApplication } from './__fixtures__/kyc-application-data';
import { KycAgreement } from '../src/renderer/kyc/application/kyc-agreement';
import { KycChecklist, KycChecklistItem } from '../src/renderer/kyc/application/kyc-checklist';

storiesOf('KYC/Requirements List', module)
	.add('Loading', () => (
		<KycRequirementsList requirements={[]} title="title" subtitle="subtitle" loading />
	))
	.add('Display list', () => (
		<KycRequirementsList
			requirements={KYCRequirementData}
			title="KYC Requirements and Forms"
			subtitle="simple description"
		/>
	));

storiesOf('KYC/Application Status bar', module)
	.add('no status', () => <ApplicationStatusBar />)
	.add('completed', () => <ApplicationStatusBar status="completed" />)
	.add('progress', () => <ApplicationStatusBar status="progress" />)
	.add('progress with contact', () => (
		<ApplicationStatusBar status="progress" contact="help@flagtheory.com" />
	))
	.add('unpaid', () => (
		<ApplicationStatusBar status="unpaid" statusAction={action('pay action')} />
	))
	.add('additional requirements', () => (
		<ApplicationStatusBar
			status="additionalRequirements"
			statusAction={action('redirect action')}
		/>
	))
	.add('rejected', () => <ApplicationStatusBar status="rejected" />);

storiesOf('KYC/CurrentApplication/Agreement', module)
	.add('default', () => (
		<KycAgreement text="text" value={false} onChange={action('agreement change')} />
	))
	.add('checked', () => (
		<KycAgreement text="Agreement text" value={1} onChange={action('agreement change')} />
	))
	.add('error', () => (
		<KycAgreement
			text="Agreement text"
			value={false}
			onChange={action('agreement change')}
			error
		/>
	));

storiesOf('KYC/CurrentApplication/KycChecklistItem', module)
	.add('multiple', () => (
		<KycChecklistItem
			item={{
				title: 'Multiple',
				id: 'test-id',
				uiId: 'test-ui-id-1',
				options: [
					{
						id: 'test-opt-id-1',
						name: 'test option 1'
					},
					{
						id: 'test-opt-id-2',
						name: 'test option 2'
					}
				]
			}}
			selectedAttributes={{}}
			onSelected={action('attribute selected')}
			editItem={action('edit item')}
			addItem={action('add item')}
		/>
	))
	.add('multiple selected', () => (
		<KycChecklistItem
			item={{
				title: 'Multiple',
				id: 'test-id',
				uiId: 'test-ui-id-1',
				options: [
					{
						id: 'test-opt-id-1',
						name: 'test option 1'
					},
					{
						id: 'test-opt-id-2',
						name: 'test option 2'
					}
				]
			}}
			selectedAttributes={{
				'test-ui-id-1': { id: 'test-opt-id-2' }
			}}
			onSelected={action('attribute selected')}
			editItem={action('edit item')}
			addItem={action('add item')}
		/>
	))
	.add('multiple duplicate', () => (
		<KycChecklistItem
			item={{
				title: 'Multiple',
				id: 'test-id',
				uiId: 'test-ui-id-1',
				duplicateType: true,
				options: [
					{
						id: 'test-opt-id-1',
						name: 'test option 1'
					},
					{
						id: 'test-opt-id-2',
						name: 'test option 2'
					}
				]
			}}
			selectedAttributes={{}}
			onSelected={action('attribute selected')}
			editItem={action('edit item')}
			addItem={action('add item')}
		/>
	))
	.add('single', () => (
		<KycChecklistItem
			item={{
				title: 'Single',
				id: 'test-id',
				uiId: 'test-ui-id-1',
				options: [
					{
						id: 'test-opt-id-1',
						name: 'test option 1'
					}
				]
			}}
			selectedAttributes={{}}
			onSelected={action('attribute selected')}
			editItem={action('edit item')}
			addItem={action('add item')}
		/>
	))
	.add('empty', () => (
		<KycChecklistItem
			item={{
				title: 'Empty',
				id: 'test-id',
				uiId: 'test-ui-id-1',
				options: []
			}}
			selectedAttributes={{}}
			onSelected={action('attribute selected')}
			editItem={action('edit item')}
			addItem={action('add item')}
		/>
	))
	.add('empty required', () => (
		<KycChecklistItem
			item={{
				title: 'Empty',
				id: 'test-id',
				uiId: 'test-ui-id-1',
				options: [],
				required: true
			}}
			selectedAttributes={{}}
			onSelected={action('attribute selected')}
			editItem={action('edit item')}
			addItem={action('add item')}
		/>
	));

storiesOf('KYC/CurrentApplication/KycChecklist', module).add('list', () => (
	<KycChecklist
		requirements={KYCRequirementData}
		selectedAttributes={{}}
		onSelected={action('attribute selected')}
		editItem={action('edit item')}
		addItem={action('add item')}
	/>
));

storiesOf('KYC/CurrentApplication/Popup', module)
	.add('loading', () => <CurrentApplicationPopup />)
	.add('default', () => (
		<CurrentApplicationPopup
			relyingParty={relyingParty}
			currentApplication={individualApplication}
			requirements={KYCRequirementData}
			selectedAttributes={{}}
			onSelected={action('attribute selected')}
			editItem={action('edit item')}
			addItem={action('add item')}
			{...individualApplication}
			onAgreementChange={action('agreement change')}
			onSubmit={action('submit')}
			onClose={action('close')}
		/>
	))
	.add('existing', () => (
		<CurrentApplicationPopup
			relyingParty={relyingParty}
			currentApplication={individualApplication}
			requirements={KYCRequirementData}
			selectedAttributes={{}}
			onSelected={action('attribute selected')}
			editItem={action('edit item')}
			addItem={action('add item')}
			{...individualApplication}
			onAgreementChange={action('agreement change')}
			onSubmit={action('submit')}
			onClose={action('close')}
			existingApplicationId={'test application id'}
		/>
	))
	.add('error', () => (
		<CurrentApplicationPopup
			relyingParty={relyingParty}
			currentApplication={individualApplication}
			requirements={KYCRequirementData}
			selectedAttributes={{}}
			onSelected={action('attribute selected')}
			editItem={action('edit item')}
			addItem={action('add item')}
			{...individualApplication}
			error={'test error'}
			onAgreementChange={action('agreement change')}
			onSubmit={action('submit')}
			onClose={action('close')}
		/>
	));
