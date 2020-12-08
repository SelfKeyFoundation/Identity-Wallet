import React from 'react';
import { storiesOf } from '@storybook/react';
import ApproveSessionComponent from '../src/renderer/wallet-connect/approve-session-component';
import { action } from '@storybook/addon-actions';
import SignMessageComponent from '../src/renderer/wallet-connect/sign-message-component';

storiesOf('WalletConnect', module);

const peerMeta = {
	icons: ['http://keyfi.com/favicon.svg'],
	name: 'Test App',
	description: 'Test app is made for testing stuff',
	url: 'http://localhost:6007'
};

storiesOf('WalletConnect/ApproveSession')
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

storiesOf('WalletConnect/SignMessage').add('default', () => (
	<SignMessageComponent
		peerMeta={peerMeta}
		onCancel={action('cancel')}
		onSignMessage={action('sign message')}
		message="HI! I am the message to sign"
		address="0xdadasdasdsa"
	/>
));
