import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { text, object } from '@storybook/addon-knobs';
import { StakingDashboardPage } from '../src/renderer/staking/dashboard/dashboard-page';
import { StakingDashboardCard } from '../src/renderer/staking/dashboard/dashboard-card';
import { SelfkeyLogo } from 'selfkey-ui';
import StakingDashboardInfoCard from '../src/renderer/staking/dashboard/info-card';

storiesOf('Staking/Dashboard/DashboardCard', module)
	.add('default', () => (
		<StakingDashboardCard
			token={{ symbol: 'KEY', decimal: 18 }}
			balance="160000"
			title="Total KEY Balance"
			icon={<SelfkeyLogo width={29} height={33} />}
		>
			Hello
		</StakingDashboardCard>
	))
	.add('info', () => <StakingDashboardInfoCard />);

storiesOf('Staking/Dashboard/Page', module).add('default', () => <StakingDashboardPage />);
