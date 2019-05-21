import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import {
	BankingOffersTable,
	BankingOffersPage,
	BankingAccountTypeTabs
} from '../src/renderer/marketplace/banking';
import {
	BankingDetailsPage,
	BankingApplicationButton
} from '../src/renderer/marketplace/banking/details';
import { bankingOffers } from './banking-data';

const KEY_RATE = 1 / 1000;

storiesOf('Banking', module).add('Offers Table', () => (
	<div style={{ width: '1140px' }}>
		<BankingOffersTable
			keyRate={KEY_RATE}
			data={bankingOffers}
			onDetails={action('banking offers table details')}
		/>
	</div>
));

storiesOf('Banking/Account Type Tabs', module)
	.add('personal', () => (
		<div style={{ width: '1140px' }}>
			<BankingAccountTypeTabs
				accountType="personal"
				onAccountTypeChange={action('account type change')}
			/>
		</div>
	))
	.add('corporate', () => (
		<div style={{ width: '1140px' }}>
			<BankingAccountTypeTabs
				accountType="corporate"
				onAccountTypeChange={action('account type change')}
			/>
		</div>
	))
	.add('private', () => (
		<div style={{ width: '1140px' }}>
			<BankingAccountTypeTabs
				accountType="private"
				onAccountTypeChange={action('account type change')}
			/>
		</div>
	));

storiesOf('Banking/OffersPage', module)
	.add('loading', () => (
		<BankingOffersPage
			keyRate={KEY_RATE}
			data={bankingOffers}
			onDetails={action('banking offers page details')}
			onBackClick={action('banking offers page back')}
			loading
		/>
	))
	.add('personal', () => (
		<BankingOffersPage
			keyRate={KEY_RATE}
			data={bankingOffers.filter(bank => bank.type === 'personal')}
			accountType="personal"
			onAccountTypeChange={action('banking offers page account type change')}
			onDetails={action('banking offers page details')}
			onBackClick={action('banking offers page back')}
		/>
	))
	.add('corporate', () => (
		<BankingOffersPage
			keyRate={KEY_RATE}
			data={bankingOffers.filter(bank => bank.type === 'corporate')}
			accountType="corporate"
			onAccountTypeChange={action('banking offers page account type change')}
			onDetails={action('banking offers page details')}
			onBackClick={action('banking offers page back')}
		/>
	))
	.add('private', () => (
		<BankingOffersPage
			keyRate={KEY_RATE}
			data={bankingOffers.filter(bank => bank.type === 'private')}
			accountType="private"
			onAccountTypeChange={action('banking offers page account type change')}
			onDetails={action('banking offers page details')}
			onBackClick={action('banking offers page back')}
		/>
	));

storiesOf('Banking/BankingApplicationButton', module)
	.add('default', () => (
		<BankingApplicationButton
			canOpenBankAccount
			startApplication={action('banking start Application')}
		/>
	))
	.add('loading', () => (
		<BankingApplicationButton
			loading
			canOpenBankAccount
			startApplication={action('banking start Application')}
		/>
	))
	.add('cannot open', () => (
		<BankingApplicationButton
			canOpenBankAccount={false}
			startApplication={action('banking start Application')}
		/>
	));

const resume = [
	[
		{
			name: 'Min. Avg. Balance',
			value: 'SGD 10,000',
			highlited: true
		},
		{
			name: 'Monthly Min. Avg, Balance',
			value: 'SGD 5,000',
			highlited: true
		}
	],
	[
		{
			name: 'Personal Visit Required',
			value: 'yes',
			highlited: true
		},
		{
			name: 'Time to open',
			value: '2-4 weeks',
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

storiesOf('Banking/BankingDetailsPage', module)
	.add('default', () => (
		<BankingDetailsPage
			countryCode="us"
			price="1500"
			keyRate="0.0001"
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			onBack={action('banking details back')}
		/>
	))
	.add('application completed', () => (
		<BankingDetailsPage
			countryCode="us"
			applicationStatus="completed"
			price="1500"
			keyRate="0.0001"
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			startApplication={action('banking start Application')}
			onBack={action('banking details back')}
		/>
	))
	.add('application unpaid', () => (
		<BankingDetailsPage
			countryCode="us"
			applicationStatus="unpaid"
			price="1500"
			keyRate="0.0001"
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			onPay={action('banking details pay')}
			startApplication={action('banking start Application')}
			onBack={action('banking details back')}
		/>
	))
	.add('application progress', () => (
		<BankingDetailsPage
			countryCode="us"
			applicationStatus="progress"
			price="1500"
			keyRate="0.0001"
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			startApplication={action('banking start Application')}
			onBack={action('banking details back')}
		/>
	))
	.add('application rejected', () => (
		<BankingDetailsPage
			countryCode="us"
			applicationStatus="rejected"
			price="1500"
			keyRate="0.0001"
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			startApplication={action('banking start Application')}
			onBack={action('banking details back')}
		/>
	));
