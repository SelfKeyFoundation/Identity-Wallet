import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import {
	BankingOffersTable,
	BankingOffersPage,
	BankingAccountTypeTabs
} from '../src/renderer/marketplace/banking';
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
				accountType="business"
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
			data={bankingOffers.filter(bank => bank.type === 'business')}
			accountType="business"
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
