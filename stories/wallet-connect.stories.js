import React from 'react';
import { storiesOf } from '@storybook/react';
import ApproveSessionComponent from '../src/renderer/wallet-connect/approve-session-component';
import { action } from '@storybook/addon-actions';
import SignMessageComponent from '../src/renderer/wallet-connect/sign-message-component';
import TransactionComponent from '../src/renderer/wallet-connect/transaction-component';

storiesOf('WalletConnect', module);

const peerMeta = {
	icons: ['http://keyfi.com/favicon.svg'],
	name: 'Test App',
	description: 'Test app is made for testing stuff',
	url: 'http://localhost:6007'
};

const tx = {
	from: '0xsdasdfasfasdasa',
	to: '0xasdasdasdwefqevdsadf',
	gas: 188,
	gasPrice: 12312312312321,
	nonce: 15,
	value: 14,
	data: '0xasdagakljsfdnaskldjaslkdjaslkdjasolikdjas'
};

storiesOf('WalletConnect/ApproveSession', module)
	.add('wallet-unlocked', () => (
		<ApproveSessionComponent
			peerMeta={peerMeta}
			onCancel={action('cancel')}
			onSwitchWallet={action('switch wallet')}
			onApprove={action('approve')}
			address="0xdadasdasdsa"
		/>
	))
	.add('wallet-locked', () => (
		<ApproveSessionComponent
			peerMeta={peerMeta}
			onCancel={action('cancel')}
			onSwitchWallet={action('switch wallet')}
			onApprove={action('approve')}
		/>
	));

storiesOf('WalletConnect/SignMessage', module).add('default', () => (
	<SignMessageComponent
		peerMeta={peerMeta}
		onCancel={action('cancel')}
		onSignMessage={action('sign message')}
		message="HI! I am the message to sign"
		address="0xdadasdasdsa"
	/>
));

storiesOf('WalletConnect/Transaction', module)
	.add('send', () => (
		<TransactionComponent
			method="eth_sendTransaction"
			peerMeta={peerMeta}
			onCancel={action('cancel')}
			onApprove={action('approve')}
			address="0xdadasdasdsa"
			tx={tx}
		/>
	))
	.add('sign', () => (
		<TransactionComponent
			method="eth_signTransaction"
			peerMeta={peerMeta}
			onCancel={action('cancel')}
			onApprove={action('approve')}
			address="0xdadasdasdsa"
			tx={tx}
		/>
	));
