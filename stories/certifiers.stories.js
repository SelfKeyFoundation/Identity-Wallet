import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import BecomeCertifierPage from '../src/renderer/certifiers/become-certifier-page';
import DashboardPageTabs from '../src/renderer/certifiers/dashboard/dashboard-tabs';

const dashboardDocuments = [
	{
		date: 1299904593000,
		user: {
			name: 'John May',
			did: 'did:selfkey:21174817792123'
		},
		type: 'Notarization',
		noOfDocs: 2,
		status: 'pending'
	},
	{
		date: 1569504593,
		user: {
			name: 'John June',
			did: 'did:selfkey:31044817792177'
		},
		type: 'Identity Validation',
		noOfDocs: 10,
		status: 'pending'
	},
	{
		date: 1169504593,
		user: {
			name: 'John July',
			did: 'did:selfkey:591374814712873'
		},
		type: 'Notarization',
		noOfDocs: 5,
		status: 'pending'
	},
	{
		date: 1569504593,
		user: {
			name: 'John June',
			did: 'did:selfkey:31044817792177'
		},
		type: 'identity Validation',
		noOfDocs: 10,
		status: 'pending'
	},
	{
		date: 1169504593,
		user: {
			name: 'John July',
			did: 'did:selfkey:591374814712873'
		},
		type: 'notarization',
		noOfDocs: 5,
		status: 'pending'
	}
];

const history = [
	{
		date: 1299904593000,
		user: {
			name: 'John May',
			did: 'did:selfkey:21174817792123'
		},
		revenue: {
			usd: '120',
			key: '293.920.291'
		},
		rate: '0,003229',
		noOfDocs: 2
	},
	{
		date: 1569504593,
		user: {
			name: 'John June',
			did: 'did:selfkey:31044817792177'
		},
		revenue: {
			usd: '123',
			key: '293.920.291'
		},
		rate: '0,003229',
		noOfDocs: 10
	},
	{
		date: 1169504593,
		user: {
			name: 'John July',
			did: 'did:selfkey:591374814712873'
		},
		revenue: {
			usd: '123',
			key: '293.920.291'
		},
		rate: '0,003229',
		noOfDocs: 5
	},
	{
		date: 1569504593,
		user: {
			name: 'John June',
			did: 'did:selfkey:31044817792177'
		},
		revenue: {
			usd: '123',
			key: '293.920.291'
		},
		rate: '0,003229',
		noOfDocs: 10
	},
	{
		date: 1169504593,
		user: {
			name: 'John July',
			did: 'did:selfkey:72td8w217692y3did:selfkey:72td8w217692y3'
		},
		revenue: {
			usd: '123',
			key: '293.920.291'
		},
		rate: '0,003229',
		noOfDocs: 5
	}
];

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

storiesOf('Certifiers', module).add('Become a Certifier', () => <BecomeCertifierPage />);

// const messagesReply = [
// 	{
// 		id: 809598767582156,
// 		name: 'John Paul',
// 		type: 'person',
// 		date: 1569504593,
// 		message:
// 			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum ullamcorper purus sit amet convallis. Quisque congue augue quam, dignissim aliquam lorem dignissim ac.'
// 	},
// 	{
// 		id: 2348767582156,
// 		name: 'Smith Jhonson Certifier',
// 		type: 'certifier',
// 		date: 2234104593,
// 		message:
// 			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum ullamcorper purus sit amet convallis. Quisque congue augue quam, dignissim aliquam lorem dignissim ac.  '
// 	},
// 	{
// 		id: 2348767582156,
// 		name: 'Smith Jhonson Certifier',
// 		type: 'certifier',
// 		date: 2234104593,
// 		message:
// 			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum ullamcorper purus sit amet convallis. Quisque congue augue quam, dignissim aliquam lorem dignissim ac.  '
// 	}
// ];

// const messages = [
// 	{
// 		date: 1299904593000,
// 		user: {
// 			name: 'John May',
// 			did: 'did:selfkey:21174817792123'
// 		},
// 		message: ' I need my ID card authenticated. help!',
// 		noOfDocs: 2,
// 		status: 'pending'
// 	},
// 	{
// 		date: 1569504593,
// 		user: {
// 			name: 'John June',
// 			did: 'did:selfkey:31044817792177'
// 		},
// 		message: 'Can you please provide more informations on what is exactly you…',
// 		noOfDocs: 10,
// 		status: 'pending'
// 	},
// 	{
// 		date: 1169504593,
// 		user: {
// 			name: 'John July',
// 			did: 'did:selfkey:591374814712873'
// 		},
// 		message: 'Need Certified True Copy of these',
// 		noOfDocs: 5,
// 		status: 'pending'
// 	},
// 	{
// 		date: 1569504593,
// 		user: {
// 			name: 'John June',
// 			did: 'did:selfkey:31044817792177'
// 		},
// 		message: 'Hi',
// 		noOfDocs: 10,
// 		status: 'pending'
// 	},
// 	{
// 		date: 1169504593,
// 		user: {
// 			name: 'John July',
// 			did: 'did:selfkey:72td8w217692y3did:selfkey:72td8w217692y3'
// 		},
// 		message:
// 			'Sure I can do a call on Nov 21st. I will have to install zoom but, I will have to install zoom but.',
// 		noOfDocs: 5,
// 		status: 'pending'
// 	}
// ];
