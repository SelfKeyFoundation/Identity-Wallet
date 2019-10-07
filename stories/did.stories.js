import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { RegisterDidCard } from '../src/renderer/did/register-did-card';
import { CreateDIDPopup } from '../src/renderer/did/create-did-popup';
import { AssociateDid } from '../src/renderer/did/associate-did';

storiesOf('DID/RegisterDidCard', module)
	.add('default', () => (
		<RegisterDidCard
			onRegisterDidClick={action('register did click')}
			onAssociateDidClick={action('associate did click')}
		/>
	))
	.add('pending', () => (
		<RegisterDidCard
			pending={true}
			onRegisterDidClick={action('register did click')}
			onAssociateDidClick={action('associate did click')}
		/>
	));

storiesOf('DID/CreateDIDPopup', module).add('default', () => (
	<CreateDIDPopup
		onLearnHowClicked={action('learn how click')}
		onConfirm={action('confirm click')}
		onCancel={action('cancel click')}
		open={true}
		usdNetworkFee={10}
		ethNetworkFee={15}
		tooltipNetworkFee={'this is a tooltip'}
	/>
));

storiesOf('DID/AssociateDid', module)
	.add('default', () => (
		<AssociateDid
			searching={false}
			did=""
			associateError=""
			onCancelClick={action('cancel click')}
			onFieldChange={action('field change')}
			onAssociateDidClick={action('associate did click')}
		/>
	))
	.add('filled', () => (
		<AssociateDid
			searching={false}
			did="test"
			associateError=""
			onCancelClick={action('cancel click')}
			onFieldChange={action('field change')}
			onAssociateDidClick={action('associate did click')}
		/>
	))
	.add('searching', () => (
		<AssociateDid
			searching={true}
			did="test"
			associateError=""
			onCancelClick={action('cancel click')}
			onFieldChange={action('field change')}
			onAssociateDidClick={action('associate did click')}
		/>
	))
	.add('error', () => (
		<AssociateDid
			searching={false}
			did="test"
			associateError="did error"
			onCancelClick={action('cancel click')}
			onFieldChange={action('field change')}
			onAssociateDidClick={action('associate did click')}
		/>
	));
