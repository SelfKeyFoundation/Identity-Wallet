import React from 'react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import {
	BankingOffersTable,
	BankingOffersPage,
	BankingAccountTypeTabs
} from '../src/renderer/marketplace/banking';
import {
	BankingDetailsPage,
	BankingApplicationButton,
	BankingDetailsPageTabs,
	BankingTypesTab,
	BankingCountryTab,
	BankingDescriptionTab,
	BankingServicesTab,
	BankingAccountOption
} from '../src/renderer/marketplace/banking/details';
import { resume, country, translation, bankingOffers, htmlServices } from './banking-data';
import KYCRequirementData from './kyc-requirements-data';

const KEY_RATE = 1 / 1000;

storiesOf('Banking', module).add('Offers Table', () => (
	<div style={{ width: '1140px' }}>
		<BankingOffersTable
			keyRate={KEY_RATE}
			data={bankingOffers}
			onDetails={linkTo('Banking/BankingDetailsPage', 'default')}
		/>
	</div>
));

storiesOf('Banking/Account Type Tabs', module)
	.add('personal', () => (
		<div style={{ width: '1140px' }}>
			<BankingAccountTypeTabs
				accountType="personal"
				onAccountTypeChange={linkTo(
					'Banking/Account Type Tabs',
					accountType => accountType
				)}
			/>
		</div>
	))
	.add('corporate', () => (
		<div style={{ width: '1140px' }}>
			<BankingAccountTypeTabs
				accountType="corporate"
				onAccountTypeChange={linkTo(
					'Banking/Account Type Tabs',
					accountType => accountType
				)}
			/>
		</div>
	))
	.add('private', () => (
		<div style={{ width: '1140px' }}>
			<BankingAccountTypeTabs
				accountType="private"
				onAccountTypeChange={linkTo(
					'Banking/Account Type Tabs',
					accountType => accountType
				)}
			/>
		</div>
	));

storiesOf('Banking/OffersPage', module)
	.add('loading', () => (
		<BankingOffersPage
			keyRate={KEY_RATE}
			data={bankingOffers}
			onDetails={linkTo('Banking/BankingDetailsPage', 'default')}
			onBackClick={action('banking offers page back')}
			loading
		/>
	))
	.add('personal', () => (
		<BankingOffersPage
			keyRate={KEY_RATE}
			data={bankingOffers.filter(bank => bank.type === 'personal')}
			accountType="personal"
			onAccountTypeChange={linkTo('Banking/OffersPage', accountType => accountType)}
			onDetails={linkTo('Banking/BankingDetailsPage', 'default')}
			onBackClick={action('banking offers page back')}
		/>
	))
	.add('corporate', () => (
		<BankingOffersPage
			keyRate={KEY_RATE}
			data={bankingOffers.filter(bank => bank.type === 'corporate')}
			accountType="corporate"
			onAccountTypeChange={linkTo('Banking/OffersPage', accountType => accountType)}
			onDetails={linkTo('Banking/BankingDetailsPage', 'default')}
			onBackClick={action('banking offers page back')}
		/>
	))
	.add('private', () => (
		<BankingOffersPage
			keyRate={KEY_RATE}
			data={bankingOffers.filter(bank => bank.type === 'private')}
			accountType="private"
			onAccountTypeChange={linkTo('Banking/OffersPage', accountType => accountType)}
			onDetails={linkTo('Banking/BankingDetailsPage', 'default')}
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

storiesOf('Banking/Tab Content', module)
	.add('types', () => (
		<BankingTypesTab
			options={bankingOffers.filter(offer => offer.countryCode === 'hk')}
			region="Hong Kong"
		/>
	))
	.add('description', () => <BankingDescriptionTab translation={translation} />)
	.add('country', () => (
		<BankingCountryTab
			countryCode="us"
			country={country}
			translation={translation}
			loadCountryAction={action('load country')}
		/>
	))
	.add('country loading', () => <BankingCountryTab />)
	.add('services', () => <BankingServicesTab htmlServices={htmlServices} />);

storiesOf('Banking/AccountOptions', module).add('default', () => (
	<BankingAccountOption account={bankingOffers[0]} />
));

storiesOf('Banking/Tabs Selector', module)
	.add('default', () => (
		<BankingDetailsPageTabs onTabChange={linkTo('Banking/Tabs Selector', tab => tab)} />
	))
	.add('types', () => (
		<BankingDetailsPageTabs
			tab="types"
			options={bankingOffers.filter(offer => offer.countryCode === 'hk')}
			region="Hong Kong"
			onTabChange={linkTo('Banking/Tabs Selector', tab => tab)}
		/>
	))
	.add('description', () => (
		<BankingDetailsPageTabs
			tab="description"
			translation={translation}
			onTabChange={linkTo('Banking/Tabs Selector', tab => tab)}
		/>
	))
	.add('country', () => (
		<BankingDetailsPageTabs
			countryCode="us"
			country={country}
			translation={translation}
			loadCountryAction={action('load country')}
			tab="country"
			onTabChange={linkTo('Banking/Tabs Selector', tab => tab)}
		/>
	))
	.add('services', () => (
		<BankingDetailsPageTabs
			tab="services"
			htmlServices={htmlServices}
			onTabChange={linkTo('Banking/Tabs Selector', tab => tab)}
		/>
	));

storiesOf('Banking/BankingDetailsPage', module)
	.add('default', () => (
		<BankingDetailsPage
			countryCode="us"
			price="1500"
			keyRate={KEY_RATE}
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			onTabChange={linkTo('Banking/BankingDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('banking details back')}
		/>
	))
	.add('application completed', () => (
		<BankingDetailsPage
			countryCode="us"
			applicationStatus="completed"
			price="1500"
			keyRate={KEY_RATE}
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			kycRequirements={KYCRequirementData}
			onTabChange={linkTo('Banking/BankingDetailsPage', tab => tab)}
			startApplication={action('banking start Application')}
			onBack={action('banking details back')}
		/>
	))
	.add('application unpaid', () => (
		<BankingDetailsPage
			countryCode="us"
			applicationStatus="unpaid"
			price="1500"
			keyRate={KEY_RATE}
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			kycRequirements={KYCRequirementData}
			onPay={action('banking details pay')}
			onTabChange={linkTo('Banking/BankingDetailsPage', tab => tab)}
			startApplication={action('banking start Application')}
			onBack={action('banking details back')}
		/>
	))
	.add('application progress', () => (
		<BankingDetailsPage
			countryCode="us"
			applicationStatus="progress"
			price="1500"
			keyRate={KEY_RATE}
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			kycRequirements={KYCRequirementData}
			onTabChange={linkTo('Banking/BankingDetailsPage', tab => tab)}
			startApplication={action('banking start Application')}
			onBack={action('banking details back')}
		/>
	))
	.add('application rejected', () => (
		<BankingDetailsPage
			countryCode="us"
			applicationStatus="rejected"
			price="1500"
			keyRate={KEY_RATE}
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			kycRequirements={KYCRequirementData}
			onTabChange={linkTo('Banking/BankingDetailsPage', tab => tab)}
			startApplication={action('banking start Application')}
			onBack={action('banking details back')}
		/>
	))
	.add('application loading', () => (
		<BankingDetailsPage
			countryCode="us"
			loading={true}
			price="1500"
			keyRate={KEY_RATE}
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			kycRequirements={KYCRequirementData}
			onTabChange={linkTo('Banking/BankingDetailsPage', tab => tab)}
			startApplication={action('banking start Application')}
			onBack={action('banking details back')}
		/>
	))
	.add('types', () => (
		<BankingDetailsPage
			countryCode="us"
			tab="types"
			price="1500"
			keyRate={KEY_RATE}
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			onTabChange={linkTo('Banking/BankingDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			options={bankingOffers.filter(offer => offer.countryCode === 'hk')}
			onBack={action('banking details back')}
		/>
	))
	.add('description', () => (
		<BankingDetailsPage
			countryCode="us"
			tab="description"
			price="1500"
			keyRate={KEY_RATE}
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			translation={translation}
			onTabChange={linkTo('Banking/BankingDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('banking details back')}
		/>
	))
	.add('services', () => (
		<BankingDetailsPage
			countryCode="us"
			price="1500"
			tab="services"
			keyRate={KEY_RATE}
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			htmlServices={htmlServices}
			onTabChange={linkTo('Banking/BankingDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('banking details back')}
		/>
	))
	.add('country', () => (
		<BankingDetailsPage
			countryCode="us"
			price="1500"
			tab="country"
			keyRate={KEY_RATE}
			region="United States"
			contact="help@flagtheory.com"
			resume={resume}
			canOpenBankAccount
			country={country}
			translation={translation}
			loadCountryAction={action('load country')}
			onTabChange={linkTo('Banking/BankingDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('banking details back')}
		/>
	));
