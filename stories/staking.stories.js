import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, object } from '@storybook/addon-knobs';
import { StakingDashboardPage } from '../src/renderer/staking/dashboard/dashboard-page';
import KYCRequirementData from './__fixtures__/kyc-requirements-data';
import RegisterDidCard from '../src/renderer/did/register-did-card';
import KycRequiredCard from '../src/renderer/kyc/kyc-required-card';

storiesOf('Staking', module).add('Dashboard', () => (
	<StakingDashboardPage
		didComponent={
			<RegisterDidCard
				onRegisterDidClick={action('register did click')}
				onAssociateDidClick={action('associate did click')}
			/>
		}
		kycComponent={
			<KycRequiredCard
				title={text('Title', 'KYC Required')}
				subtitle={text('Subtitle', 'Prove your identity')}
				requirements={object('Requirements', KYCRequirementData)}
			/>
		}
	/>
));
