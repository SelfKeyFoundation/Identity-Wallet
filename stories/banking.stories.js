import React from 'react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
import { resume, country, bankingOffers } from './__fixtures__/banking-data';
import KYCRequirementData from './__fixtures__/kyc-requirements-data';
import BankingOffersTable from '../src/renderer/marketplace/bank-accounts/list/offers-table';
import BankingAccountTypeTabs from '../src/renderer/marketplace/bank-accounts/list/account-type-tabs';
import BankingOffersPage from '../src/renderer/marketplace/bank-accounts/list/offers-page';
import BankingDetailsPage, {
	BankingApplicationButton
} from '../src/renderer/marketplace/bank-accounts/details/details-page';
import { BankingTypesTab } from '../src/renderer/marketplace/bank-accounts/details/details-types-tab';
import BankingDescriptionTab from '../src/renderer/marketplace/bank-accounts/details/details-description-tab';
import BankingCountryTab from '../src/renderer/marketplace/bank-accounts/details/details-country-tab';
import BankingServicesTab from '../src/renderer/marketplace/bank-accounts/details/details-services-tab';
import BankingAccountOption from '../src/renderer/marketplace/bank-accounts/common/account-option';
import BankingDetailsPageTabs from '../src/renderer/marketplace/bank-accounts/details/details-tabs';
import OptionSelection from '../src/renderer/marketplace/bank-accounts/common/option-selection';

const KEY_RATE = 1 / 1000;
const options = [
	{ ...bankingOffers[0], accountTitle: 'CityBank' },
	{ ...bankingOffers[1], accountTitle: 'HSBC' }
];

storiesOf('Banking', module)
	.add('Offers Table', () => (
		<div style={{ width: '1140px' }}>
			<BankingOffersTable
				keyRate={KEY_RATE}
				inventory={bankingOffers}
				onDetails={linkTo('Banking/BankingDetailsPage', 'default')}
			/>
		</div>
	))
	.add('OptionSelection', () => (
		<div style={{ width: '1140px' }}>
			<OptionSelection
				banks={bankingOffers[0].data.accounts}
				jurisdiction={bankingOffers[0]}
				title={'Choose Bank Option: US'}
				description1={
					'Please, choose a preffered bank and an account type to continue with the process. Make sure to check whether you fulfill the requirements below and whether you are required or not to make a personal visit to the banker to finalize the account opening.'
				}
				description2={
					'Selecting a preferred option does not guarantee opening an account with that specific bank. We start the process with your option first, but if you are not eligible for that specific bank we will suggest another bank from those available in the specific jurisdiction.'
				}
				options={options}
				countryCode="US"
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
				accountType="business"
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
			inventory={bankingOffers}
			onDetails={linkTo('Banking/BankingDetailsPage', 'default')}
			onBackClick={action('banking offers page back')}
			loading
		/>
	))
	.add('personal', () => (
		<BankingOffersPage
			keyRate={KEY_RATE}
			inventory={bankingOffers.filter(bank => bank.data.type === 'personal')}
			accountType="personal"
			onAccountTypeChange={linkTo('Banking/OffersPage', accountType => accountType)}
			onDetails={linkTo('Banking/BankingDetailsPage', 'default')}
			onBackClick={action('banking offers page back')}
		/>
	))
	.add('corporate', () => (
		<BankingOffersPage
			keyRate={KEY_RATE}
			inventory={bankingOffers.filter(bank => bank.data.type === 'business')}
			accountType="business"
			onAccountTypeChange={linkTo('Banking/OffersPage', accountType => accountType)}
			onDetails={linkTo('Banking/BankingDetailsPage', 'default')}
			onBackClick={action('banking offers page back')}
		/>
	))
	.add('private', () => (
		<BankingOffersPage
			keyRate={KEY_RATE}
			inventory={bankingOffers.filter(bank => bank.data.type === 'private')}
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
			banks={bankingOffers[0].data.accounts}
			jurisdiction={bankingOffers[0]}
			region="Hong Kong"
		/>
	))
	.add('description', () => <BankingDescriptionTab jurisdiction={bankingOffers[0]} />)
	.add('country', () => (
		<BankingCountryTab
			countryCode="us"
			country={country}
			jurisdiction={bankingOffers[0]}
			loadCountryAction={action('load country')}
		/>
	))
	.add('country loading', () => <BankingCountryTab />)
	.add('services', () => (
		<BankingServicesTab
			jurisdiction={bankingOffers[0]}
			banks={bankingOffers[0].data.accounts}
		/>
	));

storiesOf('Banking/AccountOptions', module)
	.add('default', () => (
		<BankingAccountOption
			jurisdiction={bankingOffers[0]}
			account={bankingOffers[0].data.accounts['SG1bG']}
			banks={bankingOffers[0].data.accounts}
			title="option 1"
		/>
	))
	.add('withOptions', () => (
		<BankingAccountOption
			jurisdiction={bankingOffers[0]}
			banks={bankingOffers[0].data.accounts}
			account={bankingOffers[0].data.accounts['SG2bA']}
			title="Option 1"
		/>
	))
	.add('open', () => (
		<BankingAccountOption
			jurisdiction={bankingOffers[0]}
			banks={bankingOffers[0].data.accounts}
			account={bankingOffers[0].data.accounts['SG1bG']}
			title="option 1"
			isOpen={true}
		/>
	));

storiesOf('Banking/Tabs Selector', module)
	.add('default', () => (
		<BankingDetailsPageTabs onTabChange={linkTo('Banking/Tabs Selector', tab => tab)} />
	))
	.add('types', () => (
		<BankingDetailsPageTabs
			tab="types"
			jurisdiction={bankingOffers[0]}
			banks={bankingOffers[0].data.accounts}
			region="Singapore"
			onTabChange={linkTo('Banking/Tabs Selector', tab => tab)}
		/>
	))
	.add('description', () => (
		<BankingDetailsPageTabs
			tab="description"
			jurisdiction={bankingOffers[0]}
			onTabChange={linkTo('Banking/Tabs Selector', tab => tab)}
		/>
	))
	.add('country', () => (
		<BankingDetailsPageTabs
			countryCode="us"
			country={country}
			jurisdiction={bankingOffers[0]}
			loadCountryAction={action('load country')}
			tab="country"
			onTabChange={linkTo('Banking/Tabs Selector', tab => tab)}
		/>
	))
	.add('services', () => (
		<BankingDetailsPageTabs
			tab="services"
			jurisdiction={bankingOffers[0]}
			banks={bankingOffers[0].data.accounts}
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
			timeToForm={'4'}
			whatYouGet={
				'Bank Account opening requirements are subject to change at the discretion of the bank. There might be additional fees charged by the bank itself. Bank account opening is not guaranteed and is subject to the bank policies and compliance department. There might be restrictions on UBO nationalities, business activities and/or jurisdictions. A refund is guaranteed if the account is not successfully opened, but a 15% administrative fee applies.'
			}
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
			banks={bankingOffers[0].data.accounts}
			jurisdiction={bankingOffers[0]}
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
			banks={bankingOffers[0].data.accounts}
			jurisdiction={bankingOffers[0]}
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
			banks={bankingOffers[0].data.accounts}
			jurisdiction={bankingOffers[0]}
			loadCountryAction={action('load country')}
			onTabChange={linkTo('Banking/BankingDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('banking details back')}
		/>
	));
