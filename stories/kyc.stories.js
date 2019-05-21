import React from 'react';
// import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { KycRequirementsList } from '../src/renderer/kyc/requirements/requirements-list';

import KYCRequirementData from './kyc-requirements-data';

storiesOf('KYC/Requirements List', module).add('Loading', () => (
	<KycRequirementsList requirements={[]} title="title" subtitle="subtitle" loading />
));

storiesOf('KYC/Requirements List', module).add('Loading', () => (
	<KycRequirementsList
		requirements={KYCRequirementData}
		title="KYC Requirements and Forms"
		subtitle="simple description"
	/>
));
