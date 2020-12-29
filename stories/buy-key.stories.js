import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { number, object } from '@storybook/addon-knobs';
import BuyKeyWidget from '../src/renderer/dashboard/buy-key-widget';
import BuyKeyModal from '../src/renderer/dashboard/buy-key-popup-modal';
import MoonpayAgreementModal from '../src/renderer/moonpay/moonpay-agreement-modal';
import PhoneVerificationModal from '../src/renderer/moonpay/phone-verification-modal';
import MoonpayAuthModal from '../src/renderer/moonpay/auth-modal';
import AddPaymentMethodModal from '../src/renderer/moonpay/add-payment-method-modal';
import MoonpayChooseLoginEmailModal from '../src/renderer/moonpay/choose-login-email-modal';
import MoonpayAuthErrorModal from '../src/renderer/moonpay/auth-error';
import KYCRequirementData from './__fixtures__/kyc-requirements-moonpay';
import MoonPayNotAllowedModal from '../src/renderer/moonpay/not-allowed-modal';
import MoonPayKycModal from '../src/renderer/moonpay/kyc-modal';
import EmailVerificationModal from '../src/renderer/moonpay/email-verification-modal';

storiesOf('Buy Key/Dashboard Widget', module)
	.add('default', () => (
		<div style={{ width: 400 }}>
			<BuyKeyWidget onBuyClick={action('buy key')} />
		</div>
	))
	.add('swap-enabled', () => (
		<div style={{ width: 400 }}>
			<BuyKeyWidget onBuyClick={action('buy key')} onSwapClick={action('swap key')} />
		</div>
	));

const exchanges = [
	{ id: 'binance', name: 'Binance', url: 'https://binance.com' },
	{ id: 'binance2', name: 'Binance2', trade_url: 'https://binance.com' }
];

storiesOf('Buy Key/Buy Key Popup', module)
	.add('default', () => (
		<BuyKeyModal
			address="0xsdasdsadasdasd"
			exchanges={exchanges}
			onCloseClick={action('close')}
		/>
	))
	.add('moonpay enabled', () => (
		<BuyKeyModal
			onMoonpayClick={() => {
				action('moonpay');
			}}
			address="0xsdasdsadasdasd"
			exchanges={exchanges}
			onCloseClick={action('close')}
		/>
	));

storiesOf('Buy Key/Moonpay/Terms', module).add('default', () => (
	<MoonpayAgreementModal onNext={action('agree')} onCancel={action('close')} />
));

storiesOf('Buy Key/MoonPay/Verify Phone', module)
	.add('loading', () => (
		<PhoneVerificationModal
			loading
			code=""
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onResendClick={action('resend')}
			onCodeChange={action('code change')}
			phone="+213134115151"
		/>
	))
	.add('default', () => (
		<PhoneVerificationModal
			code=""
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onResendClick={action('resend')}
			onCodeChange={action('code change')}
			phone="+213134115151"
		/>
	))
	.add('filled', () => (
		<PhoneVerificationModal
			code="1313132"
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onResendClick={action('resend')}
			onCodeChange={action('code change')}
			phone="+213134115151"
		/>
	))
	.add('error', () => (
		<PhoneVerificationModal
			code="1313132"
			error="Code verification failed"
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onResendClick={action('resend')}
			onCodeChange={action('code change')}
			phone="+213134115151"
		/>
	));

storiesOf('Buy Key/MoonPay/Verify Email', module)
	.add('loading', () => (
		<EmailVerificationModal
			loading
			code=""
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onResendClick={action('resend')}
			onCodeChange={action('code change')}
			email="test@test.com"
		/>
	))
	.add('default', () => (
		<EmailVerificationModal
			code=""
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onResendClick={action('resend')}
			onCodeChange={action('code change')}
			email="test@test.com"
		/>
	))
	.add('filled', () => (
		<EmailVerificationModal
			code="1313132"
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onResendClick={action('resend')}
			onCodeChange={action('code change')}
			email="test@test.com"
		/>
	))
	.add('error', () => (
		<EmailVerificationModal
			code="1313132"
			error="Code verification failed"
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onResendClick={action('resend')}
			onCodeChange={action('code change')}
			email="test@test.com"
		/>
	));
const emailAttributes = [
	{
		id: 1,
		name: 'Test Email',
		identityId: 1,
		typeId: 1,
		data: {
			value: 'test@test.com'
		}
	},
	{
		id: 2,
		name: 'Personal Email',
		identityId: 1,
		typeId: 1,
		data: {
			value: 'personal@test.com'
		}
	}
];

const typesByTypeId = {
	1: {
		url: 'http://platform.selfkey.org/schema/attribute/email.json'
	}
};

storiesOf('Buy Key/Moonpay/Auth', module)
	.add('AuthModal first connection', () => (
		<MoonpayAuthModal
			email="test@test.com"
			onChooseEmail={action('choose-email')}
			onNext={action('next')}
			onCancel={action('cancel')}
		/>
	))
	.add('ChooseLoginEmailModal', () => (
		<MoonpayChooseLoginEmailModal
			onNext={action('next')}
			onCancel={action('cancel')}
			onSelectOption={action('select')}
			onEditAttribute={action('edit')}
			onAddAttribute={action('add')}
			selected={number('Selected Email', null)}
			typesByTypeId={object('Types by ID', typesByTypeId)}
			attributes={object('Array of attributes', emailAttributes)}
		/>
	))
	.add('AuthErrorModal', () => (
		<MoonpayAuthErrorModal onNext={action('next')} onCancel={action('cancel')} />
	))
	.add('AuthErrorModal with error message', () => (
		<MoonpayAuthErrorModal
			error={'authentication error'}
			onNext={action('next')}
			onCancel={action('cancel')}
		/>
	))
	.add('Service not availalbe', () => (
		<MoonPayNotAllowedModal
			ipCheck={{
				alpha2: 'AT',
				alpha3: 'AUT',
				name: 'Austria',
				ipAddress: '123.414.511.13',
				isAllowed: false,
				isBuyAllowed: true,
				isSellAllowed: true,
				state: ''
			}}
			customerCountries={[
				{
					alpha2: 'AM',
					alpha3: 'ARM',
					isBuyAllowed: true,
					isSellAllowed: false,
					isLightKycAllowed: true,
					name: 'Armenia',
					supportedDocuments: [
						'passport',
						'driving_licence',
						'national_identity_card',
						'residence_permit'
					],
					isAllowed: false
				},
				{
					alpha2: 'AU',
					alpha3: 'AUS',
					isBuyAllowed: true,
					isSellAllowed: false,
					isLightKycAllowed: true,
					name: 'Australia',
					supportedDocuments: [
						'passport',
						'driving_licence',
						'national_identity_card',
						'residence_permit'
					],
					isAllowed: false
				}
			]}
			onNext={action('next')}
			onCancel={action('cancel')}
			onLinkClick={action('link click')}
		/>
	));

storiesOf('Buy Key/Moonpay/Kyc', module)
	.add('loading', () => (
		<MoonPayKycModal
			requirements={[]}
			onNext={action('next')}
			onCancel={action('cancel')}
			onAttributeSelected={action('attribute-selected')}
			editAttribute={action('edit-attribute')}
			addAttribute={action('add-attribute')}
			loading
			selectedAttributes={[]}
		/>
	))
	.add('filled', () => (
		<MoonPayKycModal
			requirements={KYCRequirementData}
			onNext={action('next')}
			onCancel={action('cancel')}
			onAttributeSelected={action('attribute-selected')}
			editAttribute={action('edit-attribute')}
			addAttribute={action('add-attribute')}
			selectedAttributes={[]}
		/>
	))
	.add('disabled', () => (
		<MoonPayKycModal
			requirements={KYCRequirementData}
			onNext={action('next')}
			onCancel={action('cancel')}
			onAttributeSelected={action('attribute-selected')}
			editAttribute={action('edit-attribute')}
			addAttribute={action('add-attribute')}
			selectedAttributes={[]}
			disabled
		/>
	))
	.add('error', () => (
		<MoonPayKycModal
			requirements={KYCRequirementData}
			onNext={action('next')}
			onCancel={action('cancel')}
			onAttributeSelected={action('attribute-selected')}
			editAttribute={action('edit-attribute')}
			addAttribute={action('add-attribute')}
			selectedAttributes={[]}
			error="an error has occured"
		/>
	));

storiesOf('Buy Key/Moonpay/Add payment method', module)
	.add('loading', () => (
		<AddPaymentMethodModal
			loading
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onCardNumberChange={action('cc change')}
			onExpiryDateChange={action('expiry change')}
			onCCVChange={action('ccv change')}
		/>
	))
	.add('default', () => (
		<AddPaymentMethodModal
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onCardNumberChange={action('cc change')}
			onExpiryDateChange={action('expiry change')}
			onCCVChange={action('ccv change')}
		/>
	))
	.add('filled', () => (
		<AddPaymentMethodModal
			cardNumber="1234 1234 1234 1234"
			expiryDate="04/2028"
			ccv="123"
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onCardNumberChange={action('cc change')}
			onExpiryDateChange={action('expiry change')}
			onCCVChange={action('ccv change')}
		/>
	))
	.add('disabled', () => (
		<AddPaymentMethodModal
			cardNumber="1234 1234 1234 1234"
			expiryDate="04/2028"
			ccv="123"
			disabled
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onCardNumberChange={action('cc change')}
			onExpiryDateChange={action('expiry change')}
			onCCVChange={action('ccv change')}
		/>
	))
	.add('error', () => (
		<AddPaymentMethodModal
			error="Invalid expiry date"
			onContinueClick={action('continue')}
			onCloseClick={action('close')}
			onCardNumberChange={action('cc change')}
			onExpiryDateChange={action('expiry change')}
			onCCVChange={action('ccv change')}
		/>
	));
