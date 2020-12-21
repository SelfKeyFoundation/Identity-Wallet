import React from 'react';
import { storiesOf } from '@storybook/react';
// import { linkTo } from '@storybook/addon-links';
import { action } from '@storybook/addon-actions';
import ReceiveTokenTabComponent from '../src/renderer/transaction/send/components/receive-token-tab';
import SendTokenTabComponent from '../src/renderer/transaction/send/components/send-token-tab';
import CustomTransactionSettings from '../src/renderer/transaction/send/components/custom-transaction-settings';

const ethGasStationInfo = {
	safeLow: 22,
	average: 35,
	fast: 50
};

const tokens = [
	{
		symbol: 'ETH',
		price: '200'
	}
];

storiesOf('Transactions', module)
	.add('Receive Token', () => (
		<ReceiveTokenTabComponent
			sendingAddress={'0x27462DF3542882455E3bD6a23496a06E5E686162'}
			cryptoCurrency={'ETH'}
		/>
	))
	.add('Send Token', () => (
		<div style={{ width: '780px' }}>
			<SendTokenTabComponent
				balance={220}
				tokens={tokens}
				ethGasStationInfo={ethGasStationInfo}
				locale="en"
				amountUsd="5.45"
				fiatCurrency="USD"
				sending={false}
				address={'0x27462DF3542882455E3bD6a23496a06E5E686162'}
				amount={1.22}
				gasLimit={2100}
				gasPrice={35}
				nonce={231}
				handleAddressChange={action('address changed')}
				handleAmountChange={action('amount changed')}
				handleGasLimitChange={action('gas limit changed')}
				handleGasPriceChange={action('gas price changed')}
				handleNonceChange={action('nounce changed')}
				reloadEthGasStationInfoAction={action('reload eth gas station data')}
				handleAllAmountClick={action('all amount clicked')}
				handleConfirm={action('click confirm')}
				handleCancel={action('click cancel')}
				handleSend={action('click send')}
			/>
		</div>
	))
	.add('Send Token/Custom Settings', () => (
		<div style={{ width: '780px' }}>
			<CustomTransactionSettings
				ethGasStationInfo={ethGasStationInfo}
				locale="en"
				fiatCurrency="USD"
				gasLimit={2100}
				gasPrice={35}
				nonce={231}
				handleGasLimitChange={action('gas limit changed')}
				handleGasPriceChange={action('gas price changed')}
				handleNonceChange={action('nounce changed')}
				reloadEthGasStationInfoAction={action('reload eth gas station data')}
			/>
		</div>
	));
