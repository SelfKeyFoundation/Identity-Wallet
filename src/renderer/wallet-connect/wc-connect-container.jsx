import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { walletConnectSelectors, walletConnectOperations } from '../../common/wallet-connect';
import { WcConnectComponent } from './wc-connect-component';
import { getWallet } from '../../common/wallet/selectors';

export const WCConnectContainer = () => {
	const dispatch = useDispatch();

	const { peerMeta, message, isLoading } = useSelector(
		walletConnectSelectors.selectWalletConnect
	);
	const wallet = useSelector(getWallet);
	const address = wallet ? wallet.address : undefined;

	const handleCancel = () => dispatch(push('/main/dashboard'));

	const handleOnCopyOption = () => dispatch(push('/wallet-connect/paste-qr-code-option'));
	const handleOnScanOption = () => dispatch(walletConnectOperations.scanQRCodeOperation());

	const handleManageSessions = () => dispatch(push('/wallet-connect/sessions'));

	return (
		<WcConnectComponent
			isLoading={isLoading}
			address={address}
			message={message}
			peerMeta={peerMeta}
			onCancel={handleCancel}
			onCopyOption={handleOnCopyOption}
			onScanOption={handleOnScanOption}
			onClickManage={handleManageSessions}
		/>
	);
};

export default WCConnectContainer;
