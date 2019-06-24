import React from 'react';

import IncorporationOffersTable from '../src/renderer/marketplace/incorporation/list/offers-table';
import { incorporationOffers, program, country } from './incorporation-data';

import {
	IncorporationDetailsPage,
	ApplyIncorporationButton
} from '../src/renderer/marketplace/incorporation/details/details-page';
import DetailsTab from '../src/renderer/marketplace/incorporation/details/details-tab';
import LegalViewTab from '../src/renderer/marketplace/incorporation/details/legal-view-tab';
import TaxViewTab from '../src/renderer/marketplace/incorporation/details/tax-view-tab';
import DescriptionTab from '../src/renderer/marketplace/incorporation/details/description-tab';
import CountryDetailsTab from '../src/renderer/marketplace/incorporation/details/country-details-tab';
import ServicesTab from '../src/renderer/marketplace/incorporation/details/services-tab';
import TaxTreaties from '../src/renderer/marketplace/incorporation/details/tax-treaties-tab';
import KYCRequirementData from './kyc-requirements-data';

import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';

const KEY_RATE = 0.0031710207206;

storiesOf('Incorporation', module).add('Offers Table', () => (
	<div style={{ width: '1140px' }}>
		<IncorporationOffersTable
			keyRate={KEY_RATE}
			data={incorporationOffers}
			onDetails={linkTo('Incorporation/IncorporationDetailsPage', 'default')}
			getPrice={inc => 10}
			getTemplateId={() => 1}
		/>
	</div>
));

storiesOf('Incorporation/IncorporationApplicationButton', module)
	.add('default', () => (
		<ApplyIncorporationButton
			canIncorporate
			price="1.0"
			keyRate={KEY_RATE}
			startApplication={action('incorporation start Application')}
		/>
	))
	.add('loading', () => (
		<ApplyIncorporationButton
			loading
			canIncorporate
			price="1.0"
			keyRate={KEY_RATE}
			startApplication={action('incorporation start Application')}
		/>
	))
	.add('cannot open', () => (
		<ApplyIncorporationButton
			canIncorporate={false}
			price="1.0"
			keyRate={KEY_RATE}
			startApplication={action('incorporation start Application')}
		/>
	));

storiesOf('Incorporation/IncorporationDetailsPage', module)
	.add('default', () => (
		<IncorporationDetailsPage
			countryCode="us"
			price="1500"
			canIncorporate={true}
			treaties={[]}
			keyRate={KEY_RATE}
			program={program}
			region="United States"
			contact="help@flagtheory.com"
			canOpenBankAccount
			onTabChange={linkTo('Incorporation/IncorporationDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('incorporation details back')}
		/>
	))
	.add('application completed', () => (
		<IncorporationDetailsPage
			countryCode="us"
			price="1500"
			applicationStatus="completed"
			canIncorporate={true}
			treaties={[]}
			keyRate={KEY_RATE}
			program={program}
			region="United States"
			contact="help@flagtheory.com"
			canOpenBankAccount
			onTabChange={linkTo('Incorporation/IncorporationDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('incorporation details back')}
			startApplication={action('incorporation start Application')}
		/>
	))
	.add('application unpaid', () => (
		<IncorporationDetailsPage
			countryCode="us"
			price="1500"
			applicationStatus="unpaid"
			canIncorporate={true}
			keyRate={KEY_RATE}
			treaties={[]}
			program={program}
			region="United States"
			contact="help@flagtheory.com"
			onPay={action('incorporation details pay')}
			canOpenBankAccount
			onTabChange={linkTo('Incorporation/IncorporationDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('incorporation details back')}
			startApplication={action('incorporation start Application')}
		/>
	))
	.add('application progress', () => (
		<IncorporationDetailsPage
			countryCode="us"
			price="1500"
			applicationStatus="progress"
			canIncorporate={true}
			treaties={[]}
			keyRate={KEY_RATE}
			program={program}
			region="United States"
			contact="help@flagtheory.com"
			onPay={action('incorporation details pay')}
			canOpenBankAccount
			onTabChange={linkTo('Incorporation/IncorporationDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('incorporation details back')}
			startApplication={action('incorporation start Application')}
		/>
	))
	.add('application progress', () => (
		<IncorporationDetailsPage
			countryCode="us"
			price="1500"
			applicationStatus="progress"
			canIncorporate={true}
			keyRate={KEY_RATE}
			treaties={[]}
			program={program}
			region="United States"
			contact="help@flagtheory.com"
			onPay={action('incorporation details pay')}
			canOpenBankAccount
			onTabChange={linkTo('Incorporation/IncorporationDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('incorporation details back')}
			startApplication={action('incorporation start Application')}
		/>
	))
	.add('application loading', () => (
		<IncorporationDetailsPage
			countryCode="us"
			price="1500"
			loading={true}
			canIncorporate={true}
			keyRate={KEY_RATE}
			treaties={[]}
			program={program}
			region="United States"
			contact="help@flagtheory.com"
			onPay={action('incorporation details pay')}
			canOpenBankAccount
			onTabChange={linkTo('Incorporation/IncorporationDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('incorporation details back')}
			startApplication={action('incorporation start Application')}
		/>
	))
	.add('description', () => (
		<IncorporationDetailsPage
			countryCode="us"
			price="1500"
			tab="description"
			loading={true}
			canIncorporate={true}
			keyRate={KEY_RATE}
			program={program}
			treaties={[]}
			region="United States"
			contact="help@flagtheory.com"
			onPay={action('incorporation details pay')}
			canOpenBankAccount
			onTabChange={linkTo('Incorporation/IncorporationDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('incorporation details back')}
			startApplication={action('incorporation start Application')}
		/>
	))
	.add('legal', () => (
		<IncorporationDetailsPage
			countryCode="us"
			price="1500"
			tab="legal"
			loading={true}
			canIncorporate={true}
			keyRate={KEY_RATE}
			program={program}
			treaties={[]}
			region="United States"
			contact="help@flagtheory.com"
			onPay={action('incorporation details pay')}
			canOpenBankAccount
			onTabChange={linkTo('Incorporation/IncorporationDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('incorporation details back')}
			startApplication={action('incorporation start Application')}
		/>
	))
	.add('tax', () => (
		<IncorporationDetailsPage
			countryCode="us"
			price="1500"
			tab="tax"
			loading={true}
			canIncorporate={true}
			keyRate={KEY_RATE}
			program={program}
			treaties={[]}
			region="United States"
			contact="help@flagtheory.com"
			onPay={action('incorporation details pay')}
			canOpenBankAccount
			onTabChange={linkTo('Incorporation/IncorporationDetailsPage', tab => tab)}
			kycRequirements={KYCRequirementData}
			onBack={action('incorporation details back')}
			startApplication={action('incorporation start Application')}
		/>
	))
	.add('countryDetails', () => (
		<IncorporationDetailsPage
			countryCode="us"
			price="1500"
			tab="countryDetails"
			loading={true}
			country={country}
			canIncorporate={true}
			keyRate={KEY_RATE}
			program={program}
			region="United States"
			contact="help@flagtheory.com"
			treaties={[]}
			onPay={action('incorporation details pay')}
			canOpenBankAccount
			onTabChange={linkTo('Incorporation/IncorporationDetailsPage', tab => tab)}
			onFetchCountries={action('on fetch country')}
			kycRequirements={KYCRequirementData}
			onBack={action('incorporation details back')}
			startApplication={action('incorporation start Application')}
		/>
	))
	.add('taxTreaties', () => (
		<IncorporationDetailsPage
			countryCode="us"
			price="1500"
			tab="taxTreaties"
			treaties={[]}
			loading={true}
			country={country}
			canIncorporate={true}
			keyRate={KEY_RATE}
			program={program}
			region="United States"
			contact="help@flagtheory.com"
			onPay={action('incorporation details pay')}
			canOpenBankAccount
			onTabChange={linkTo('Incorporation/IncorporationDetailsPage', tab => tab)}
			onFetchCountries={action('on fetch country')}
			kycRequirements={KYCRequirementData}
			onBack={action('incorporation details back')}
			startApplication={action('incorporation start Application')}
		/>
	))
	.add('services', () => (
		<IncorporationDetailsPage
			countryCode="us"
			price="1500"
			tab="services"
			loading={true}
			country={country}
			canIncorporate={true}
			keyRate={KEY_RATE}
			treaties={[]}
			program={program}
			region="United States"
			contact="help@flagtheory.com"
			onPay={action('incorporation details pay')}
			canOpenBankAccount
			onTabChange={linkTo('Incorporation/IncorporationDetailsPage', tab => tab)}
			onFetchCountries={action('on fetch country')}
			kycRequirements={KYCRequirementData}
			onBack={action('incorporation details back')}
			startApplication={action('incorporation start Application')}
		/>
	));

storiesOf('Incorporation/Tab Content', module)
	.add('description', () => <DescriptionTab program={program} />)
	.add('legal', () => <LegalViewTab program={program} />)
	.add('tax', () => <TaxViewTab program={program} />)
	.add('countryDetails', () => (
		<CountryDetailsTab program={program} onFetchCountries={() => {}} country={country} />
	))
	.add('services', () => <ServicesTab program={program} />)
	.add('taxTreaties', () => <TaxTreaties program={program} treaties={[]} />);

storiesOf('Incorporation/Tabs Selector', module)
	.add('default', () => (
		<DetailsTab
			program={program}
			treaties={[]}
			onTabChange={linkTo('Incorporation/Tabs Selector', tab => tab)}
		/>
	))
	.add('description', () => (
		<DetailsTab
			tab="description"
			program={program}
			treaties={[]}
			onTabChange={linkTo('Incorporation/Tabs Selector', tab => tab)}
		/>
	))
	.add('legal', () => (
		<DetailsTab
			tab="legal"
			program={program}
			treaties={[]}
			onTabChange={linkTo('Incorporation/Tabs Selector', tab => tab)}
		/>
	))
	.add('tax', () => (
		<DetailsTab
			tab="tax"
			program={program}
			treaties={[]}
			onTabChange={linkTo('Incorporation/Tabs Selector', tab => tab)}
		/>
	))
	.add('countryDetails', () => (
		<DetailsTab
			tab="countryDetails"
			program={program}
			treaties={[]}
			onTabChange={linkTo('Incorporation/Tabs Selector', tab => tab)}
		/>
	))
	.add('services', () => (
		<DetailsTab
			tab="services"
			program={program}
			treaties={[]}
			onTabChange={linkTo('Incorporation/Tabs Selector', tab => tab)}
		/>
	))
	.add('taxTreaties', () => (
		<DetailsTab
			tab="taxTreaties"
			program={program}
			treaties={[]}
			onTabChange={linkTo('Incorporation/Tabs Selector', tab => tab)}
		/>
	))
	.add('countryDetails', () => (
		<DetailsTab
			tab="countryDetails"
			program={program}
			treaties={[]}
			onTabChange={linkTo('Incorporation/Tabs Selector', tab => tab)}
			onFetchCountries={action('fetch countries')}
			country={country}
		/>
	));
