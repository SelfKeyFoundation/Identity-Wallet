import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import BuyKeyWidget from '../src/renderer/dashboard/buy-key-widget';
import BuyKeyModal from '../src/renderer/dashboard/buy-key-popup-modal';
import MoonpayAgreementModal from '../src/renderer/dashboard/moonpay-agreement-modal';

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

storiesOf('Buy Key/Moonpay/Moonpay', module).add('AgreementModal', () => (
	<MoonpayAgreementModal onAgreeClick={action('agree')} onCloseClick={action('close')} />
));
