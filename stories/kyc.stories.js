import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { KycRequirementsList } from '../src/renderer/kyc/requirements/requirements-list';
import { ApplicationStatusBar } from '../src/renderer/kyc/application/application-status';
import { CurrentApplicationPopup } from '../src/renderer/kyc/application/current-application-popup';
import KYCRequirementData from './__fixtures__/kyc-requirements-data';
import KYCMembersRequirementData from './__fixtures__/kyc-members-requirements-data';
import {
	relyingParty,
	individualApplication,
	individualApplicationKnobs
} from './__fixtures__/kyc-application-data';
import { KycAgreement } from '../src/renderer/kyc/application/kyc-agreement';
import { text, boolean, object, select } from '@storybook/addon-knobs';
import {
	KycChecklist,
	KycChecklistItem,
	KycMembersListItem
} from '../src/renderer/kyc/application/kyc-checklist';

storiesOf('KYC/Requirements List', module)
	.add('Loading', () => (
		<KycRequirementsList
			requirements={object('Requirements', [])}
			title={text('Title', 'title')}
			subtitle={text('Subtitle', 'subtitle')}
			loading={boolean('Loading', true)}
		/>
	))
	.add('Display list', () => (
		<KycRequirementsList
			requirements={object('Requirements', KYCRequirementData)}
			title={text('Title', 'KYC Requirements and Forms')}
			subtitle={text('Subtitle', 'simple description')}
		/>
	));

const kycStatuses = ['completed', 'progress', 'unpaid', 'additionalRequirements', 'rejected'];

storiesOf('KYC/Application Status bar', module)
	.add('no status', () => <ApplicationStatusBar />)
	.add('completed', () => (
		<ApplicationStatusBar status={select('Status', kycStatuses, 'completed')} />
	))
	.add('progress', () => (
		<ApplicationStatusBar status={select('Status', kycStatuses, 'progress')} />
	))
	.add('progress with contact', () => (
		<ApplicationStatusBar
			status={select('Status', kycStatuses, 'progress')}
			contact={text('Contact', 'help@flagtheory.com')}
		/>
	))
	.add('unpaid', () => (
		<ApplicationStatusBar
			status={select('Status', kycStatuses, 'unpaid')}
			statusAction={action('pay action')}
		/>
	))
	.add('additional requirements', () => (
		<ApplicationStatusBar
			status={select('Status', kycStatuses, 'additionalRequirements')}
			statusAction={action('redirect action')}
		/>
	))
	.add('rejected', () => (
		<ApplicationStatusBar status={select('Status', kycStatuses, 'rejected')} />
	));

storiesOf('KYC/CurrentApplication/Agreement', module)
	.add('default', () => (
		<KycAgreement
			text={text('Text', 'text')}
			value={select('Checked', [false, '1'], false)}
			onChange={action('agreement change')}
		/>
	))
	.add('checked', () => (
		<KycAgreement
			text={text('Text', 'Agreement text')}
			value={select('Checked', [false, '1'], '1')}
			onChange={action(text('Action text', 'agreement change'))}
		/>
	))
	.add('error', () => (
		<KycAgreement
			text={text('Text', 'Agreement text')}
			value={select('Checked', [false, '1'], false)}
			onChange={action(text('Action text', 'agreement change'))}
			error={boolean('Error', true)}
		/>
	));

storiesOf('KYC/CurrentApplication/KycChecklistItem', module)
	.add('multiple', () => (
		<KycChecklistItem
			item={object('List Item', {
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
			})}
			selectedAttributes={object('Selected Attributes', {})}
			onSelected={action(text('Selected Action Text', 'attribute selected'))}
			editItem={action(text('Edit Action text', 'edit item'))}
			addItem={action(text('Add Item text', 'add item'))}
		/>
	))
	.add('multiple selected', () => (
		<KycChecklistItem
			item={object('List Item', {
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
			})}
			selectedAttributes={object('Selected Attributes', {
				'_test-ui-id-1': { id: 'test-opt-id-2' }
			})}
			onSelected={action(text('Selected Action Text', 'attribute selected'))}
			editItem={action(text('Edit Action text', 'edit item'))}
			addItem={action(text('Add Item text', 'add item'))}
		/>
	))
	.add('multiple duplicate', () => (
		<KycChecklistItem
			item={object('List Item', {
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
			})}
			selectedAttributes={object('Selected Attributes', {})}
			onSelected={action(text('Selected Action Text', 'attribute selected'))}
			editItem={action(text('Edit Action text', 'edit item'))}
			addItem={action(text('Add Item text', 'add item'))}
		/>
	))
	.add('single', () => (
		<KycChecklistItem
			item={object(
				'List Item',
				object('List Item', {
					title: 'Single',
					id: 'test-id',
					uiId: 'test-ui-id-1',
					options: [
						{
							id: 'test-opt-id-1',
							name: 'test option 1'
						}
					]
				})
			)}
			selectedAttributes={object('Selected Attributes', {})}
			onSelected={action(text('Selected Action Text', 'attribute selected'))}
			editItem={action(text('Edit Action text', 'edit item'))}
			addItem={action(text('Add Item text', 'add item'))}
		/>
	))
	.add('empty', () => (
		<KycChecklistItem
			item={object('List Item', {
				title: 'Empty',
				id: 'test-id',
				uiId: 'test-ui-id-1',
				options: []
			})}
			selectedAttributes={object('Selected Attributes', {})}
			onSelected={action(text('Selected Action Text', 'attribute selected'))}
			editItem={action(text('Edit Action text', 'edit item'))}
			addItem={action(text('Add Item text', 'add item'))}
		/>
	))
	.add('empty required', () => (
		<KycChecklistItem
			item={object('List Item', {
				title: 'Empty',
				id: 'test-id',
				uiId: 'test-ui-id-1',
				options: [],
				required: true
			})}
			selectedAttributes={object('Selected Attributes', {})}
			onSelected={action(text('Selected Action Text', 'attribute selected'))}
			editItem={action(text('Edit Action text', 'edit item'))}
			addItem={action(text('Add Item text', 'add item'))}
		/>
	));

storiesOf('KYC/CurrentApplication/KycChecklist', module)
	.add('individual', () => (
		<KycChecklist
			requirements={object('Requirements', KYCRequirementData)}
			selectedAttributes={object('Selected Attributes', {})}
			onSelected={action(text('Selected Action Text', 'attribute selected'))}
			editItem={action(text('Edit Action text', 'edit item'))}
			addItem={action(text('Add Item text', 'add item'))}
		/>
	))
	.add('corporate', () => (
		<KycChecklist
			userData={{ name: 'Corporation' }}
			requirements={object('Requirements', KYCRequirementData)}
			memberRequirements={KYCMembersRequirementData || []}
			selectedAttributes={object('Selected Attributes', {})}
			onSelected={action(text('Selected Action Text', 'attribute selected'))}
			editItem={action(text('Edit Action text', 'edit item'))}
			addItem={action(text('Add Item text', 'add item'))}
		/>
	));

storiesOf('KYC/CurrentApplication/Popup', module)
	.add('loading', () => <CurrentApplicationPopup />)
	.add('default', () => (
		<CurrentApplicationPopup
			relyingParty={object('Relying Party', relyingParty)}
			currentApplication={object('Current Application', individualApplication)}
			requirements={object('Requirements', KYCRequirementData)}
			selectedAttributes={object('Selected Attributes', {})}
			onSelected={action(text('Selected Action Text', 'attribute selected'))}
			editItem={action(text('Edit Action text', 'edit item'))}
			addItem={action(text('Add Item text', 'add item'))}
			{...individualApplicationKnobs}
			onAgreementChange={action('agreement change')}
			onSubmit={action('submit')}
			onClose={action('close')}
		/>
	))
	.add('corporate', () => (
		<CurrentApplicationPopup
			relyingParty={object('Relying Party', relyingParty)}
			userData={object('User data', { name: 'Corporation' })}
			memberRequirements={object('Member Requirements', KYCMembersRequirementData || [])}
			currentApplication={object('Current Application', individualApplication)}
			requirements={object('Requirements', KYCRequirementData)}
			selectedAttributes={object('Selected Attributes', {})}
			onSelected={action(text('Selected Action Text', 'attribute selected'))}
			editItem={action(text('Edit Action text', 'edit item'))}
			addItem={action(text('Add Item text', 'add item'))}
			{...individualApplicationKnobs}
			onAgreementChange={action(text('Agreement Action Text', 'agreement change'))}
			onSubmit={action(text('Submit Action Text', 'submit'))}
			onClose={action(text('Close Action Text', 'close'))}
		/>
	))
	.add('existing', () => (
		<CurrentApplicationPopup
			relyingParty={object('Relying Party', relyingParty)}
			currentApplication={object('Current Application', individualApplication)}
			requirements={object('Requirements', KYCRequirementData)}
			selectedAttributes={object('Selected Attributes', {})}
			onSelected={action(text('Selected Action Text', 'attribute selected'))}
			editItem={action(text('Edit Action text', 'edit item'))}
			addItem={action(text('Add Item text', 'add item'))}
			{...individualApplicationKnobs}
			onAgreementChange={action(text('Agreement Action Text', 'agreement change'))}
			onSubmit={action(text('Submit Action Text', 'submit'))}
			onClose={action(text('Close Action Text', 'close'))}
			existingApplicationId={text('Existing Application Id', 'test application id')}
		/>
	))
	.add('error', () => (
		<CurrentApplicationPopup
			relyingParty={object('Relying Party', relyingParty)}
			currentApplication={object('Current Application', individualApplication)}
			requirements={object('Requirements', KYCRequirementData)}
			selectedAttributes={object('Selected Attributes', {})}
			onSelected={action(text('Selected Action Text', 'attribute selected'))}
			editItem={action(text('Edit Action text', 'edit item'))}
			addItem={action(text('Add Item text', 'add item'))}
			{...individualApplicationKnobs}
			error={text('Error', 'test error')}
			onAgreementChange={action(text('Agreement Action Text', 'agreement change'))}
			onSubmit={action(text('Submit Action Text', 'submit'))}
			onClose={action(text('Close Action Text', 'close'))}
		/>
	));

storiesOf('KYC/CurrentApplication/KycMembersListItem', module)
	.add('main', () => (
		<KycMembersListItem
			item={object('List Item', {
				id: 'main-company',
				name: 'Test Main LTD',
				selected: false,
				warning: false,
				positions: 'Main Company'
			})}
		/>
	))
	.add('member', () => (
		<KycMembersListItem
			item={object('List Item', {
				id: 10,
				name: 'Test Member',
				selected: false,
				warning: false,
				positions: ['Director', 'Shareholder']
			})}
		/>
	))
	.add('warning', () => (
		<KycMembersListItem
			item={object('List Item', {
				id: 10,
				name: 'Test Member',
				selected: false,
				warning: true,
				positions: ['Director', 'Shareholder']
			})}
		/>
	))
	.add('selected', () => (
		<KycMembersListItem
			item={object('List Item', {
				id: 10,
				name: 'Test Member',
				selected: true,
				warning: false,
				positions: ['Director', 'Shareholder']
			})}
		/>
	));
