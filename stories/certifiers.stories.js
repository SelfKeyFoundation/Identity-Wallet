import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
// import BecomeCertifierPage fro../src/renderer/certifiers/_become-certifier-pageage';
import DashboardPageTabs from '../src/renderer/certifiers/dashboard/dashboard-tabs';
import IndividualRequestPage from '../src/renderer/certifiers/individual-request-page';
import { dashboardDocuments, individualDocuments, history, item } from './certifiers-data';

storiesOf('Certifiers/Dashboard', module)
	.add('overview', () => (
		<DashboardPageTabs
			documents={dashboardDocuments}
			requestedProcesses={6}
			completedRequests={3}
			total={25}
			totalRevenueInKey={12345678}
			tab="overview"
			onTabChange={linkTo('Certifiers/Dashboard', tab => tab)}
		/>
	))
	.add('overview - 0 process requests', () => (
		<DashboardPageTabs
			requestedProcesses={0}
			completedRequests={2}
			total={25}
			totalRevenueInKey={12345678}
			tab="overview"
			onTabChange={linkTo('Certifiers/Dashboard', tab => tab)}
		/>
	))
	.add('overview - 0 completed requests', () => (
		<DashboardPageTabs
			requestedProcesses={1}
			completedRequests={0}
			total={25}
			totalRevenueInKey={12345678}
			tab="overview"
			onTabChange={linkTo('Certifiers/Dashboard', tab => tab)}
		/>
	))
	.add('history', () => (
		<DashboardPageTabs
			documents={history}
			tab="history"
			onTabChange={linkTo('Certifiers/Dashboard', tab => tab)}
		/>
	))
	.add('analytics', () => (
		<DashboardPageTabs
			tab="analytics"
			onTabChange={linkTo('Certifiers/Dashboard', tab => tab)}
		/>
	));
// .add('Messages', () => <CertifiersDashboard tab="messages" documents={messages} />)
// .add('Message Reply', () => <MessageReply messages={messagesReply} />)

// storiesOf('Certifiers', module).add('Become a Certifier', () => <BecomeCertifierPage />)

storiesOf('Certifiers', module).add('Individual Request', () => (
	<IndividualRequestPage
		handleBackClick={linkTo('Certifiers', 'Become a Certifier')}
		documents={individualDocuments.documents}
		firstName={individualDocuments.firstName}
		lastName={individualDocuments.lastName}
		did={individualDocuments.did}
		item={item}
	/>
));
