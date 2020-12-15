import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import BuyKeyWidget from '../src/renderer/dashboard/buy-key-widget';
import BuyKeyModal from '../src/renderer/dashboard/buy-key-popup-modal';
import MoonpayAgreementModal from '../src/renderer/dashboard/moonpay-agreement-modal';
import PhoneVerificationModal from '../src/renderer/dashboard/phone-verification-modal';

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

storiesOf('Buy Key/Moonpay', module).add('AgreementModal', () => (
	<MoonpayAgreementModal onAgreeClick={action('agree')} onCloseClick={action('close')} />
));

storiesOf('Buy Key/Verify Phone', module)
	.add('loading', () => (
		<PhoneVerificationModal
			loading
			code=""
			onContinueClick={action('agree')}
			onCloseClick={action('close')}
			onResendClick={action('resend')}
			phone="+213134115151"
		/>
	))
	.add('default', () => (
		<PhoneVerificationModal
			code=""
			onContinueClick={action('agree')}
			onCloseClick={action('close')}
			onResendClick={action('resend')}
			phone="+213134115151"
		/>
	))
	.add('filled', () => (
		<PhoneVerificationModal
			code="1313132"
			onContinueClick={action('agree')}
			onCloseClick={action('close')}
			onResendClick={action('resend')}
			phone="+213134115151"
		/>
	))
	.add('error', () => (
		<PhoneVerificationModal
			code="1313132"
			error="Code verification failed"
			onContinueClick={action('agree')}
			onCloseClick={action('close')}
			onResendClick={action('resend')}
			phone="+213134115151"
		/>
	));
