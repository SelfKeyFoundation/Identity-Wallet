import { push } from 'connected-react-router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { walletConnectOperations, walletConnectSelectors } from '../../common/wallet-connect';
import ApproveSessionComponent from './approve-session-component';
import { getWallet } from '../../common/wallet/selectors';

export const ApproveSessionContainer = () => {
	const dispatch = useDispatch();

	const { peerMeta } = useSelector(walletConnectSelectors.selectWalletConnect);
	const wallet = useSelector(getWallet);
	const address = wallet ? wallet.address : undefined;

	const handleCancel = () => {
		dispatch(walletConnectOperations.sessionRequestDenyOperation());
	};

	const handleSwitchWallet = () => {
		dispatch(push('/home'));
	};

	const handleApprove = () => {
		dispatch(walletConnectOperations.sessionRequestApproveOperation());
	};

	return (
		<ApproveSessionComponent
			address={address}
			peerMeta={peerMeta}
			onCancel={handleCancel}
			onApprove={handleApprove}
			onSwitchWallet={handleSwitchWallet}
		/>
	);
};

export default ApproveSessionContainer;
