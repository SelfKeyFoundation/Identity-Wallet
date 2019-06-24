import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { KycRequirementsList } from '../src/renderer/kyc/requirements/requirements-list';
import { ApplicationStatusBar } from '../src/renderer/kyc/application/application-status';

import KYCRequirementData from './kyc-requirements-data';

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
