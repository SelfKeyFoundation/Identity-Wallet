import React from 'react';
// import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import {
	FlagCountryName,
	ProgramPrice,
	PageLoading,
	ResumeTableEntry,
	ResumeTable,
	ResumeBox
} from '../src/renderer/marketplace/common';
import PaymentCheckout from '../src/renderer/marketplace/common/payment-checkout';

const paymentCheckoutData = {
	title: 'Banking Support Service Fee: US',
	program: { Region: 'US' },
	description: 'This is a checkout description',
	timeToForm: '2 to 4 week(s)',
	countryCode: 'US',
	price: 4000,
	keyAmount: 100000,
	usdFee: 1,
	ethFee: 0.00001,
	options: [{ price: 4000, notes: 'notes', description: 'description', id: 1 }],
	onBackClick: () => {},
	onStartClick: () => {},
	startButtonText: 'Start Incorporation',
	initialDocsText:
		'You will be required to provide a few basic informations about yourself like full name and email. This will be done through SelfKey ID Wallet.',
	kycProcessText:
		'You will undergo a standard KYC process and our team will get in touch with you to make sure we have all the information needed.',
	getFinalDocsText:
		'Once the incorporations process is done you will receive all the relevant documents, for your new company, on your email.'
};

storiesOf('Marketplace Common', module)
	.add('PageLoading', () => <PageLoading />)
	.add('ProgramPrice', () => <ProgramPrice price={10} rate={0.5} label="Label" />)
	.add('FlagCountryName', () => (
		<div>
			<FlagCountryName code="ua" name="UA" />
			<br />
			<br />
			<FlagCountryName code="us" name="us" />
			<br />
			<br />
			<FlagCountryName code="gb" name="UK" />
			<br />
			<br />
		</div>
	))
	.add('PaymentCheckout', () => <PaymentCheckout {...paymentCheckoutData} />);

const resumeItemSets = [
	[
		{
			name: 'Offshore Tax',
			value: '10%'
		},
		{
			name: 'Devidients Received',
			value: '48%',
			highlited: true
		}
	],
	[
		{
			name: 'Offshore Tax',
			value: '10%'
		},
		{
			name: 'Devidients Received',
			value: '48%',
			highlited: true
		}
	],
	[
		{
			name: 'Cards',
			value: ['Debit Card (SG)', 'Credit Card (USD)'],
			highlited: true
		}
	]
];

storiesOf('Marketplace Common/Resume Table', module)
	.add('Single', () => <ResumeTableEntry {...resumeItemSets[0][0]} />)
	.add('Single highlited', () => <ResumeTableEntry {...resumeItemSets[0][1]} />)
	.add('Table', () => <ResumeTable items={resumeItemSets[0]} />)
	.add('Resume Box', () => <ResumeBox itemSets={resumeItemSets} />);
