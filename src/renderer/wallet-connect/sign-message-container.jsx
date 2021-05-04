import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { walletConnectOperations, walletConnectSelectors } from '../../common/wallet-connect';
import SignMessageComponent from './sign-message-component';
import { getWallet } from '../../common/wallet/selectors';

export const SignMessageContainer = () => {
	const dispatch = useDispatch();

	const { peerMeta, message } = useSelector(walletConnectSelectors.selectWalletConnect);
	const wallet = useSelector(getWallet);
	const address = wallet ? wallet.address : undefined;

	console.log(peerMeta);
	console.log(message);

	const handleCancel = () => {
		dispatch(walletConnectOperations.signMessageDenyOperation());
	};

	const handleSignMessage = () => {
		dispatch(walletConnectOperations.signMessageApproveOperation());
	};

	return (
		<SignMessageComponent
			address={address}
			message={message}
			peerMeta={peerMeta}
			onCancel={handleCancel}
			onSignMessage={handleSignMessage}
		/>
	);
};

export default SignMessageContainer;
