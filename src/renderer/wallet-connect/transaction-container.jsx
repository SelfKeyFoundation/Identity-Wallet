import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { walletConnectOperations, walletConnectSelectors } from '../../common/wallet-connect';
import TransactionComponent from './transaction-component';
import { getWallet } from '../../common/wallet/selectors';

export const TransactionContainer = () => {
	const dispatch = useDispatch();

	const { peerMeta, tx, method } = useSelector(walletConnectSelectors.selectWalletConnect);
	const wallet = useSelector(getWallet);
	const address = wallet ? wallet.address : undefined;

	const handleCancel = () => {
		dispatch(walletConnectOperations.transactionDenyOperation());
	};

	const handleApprove = () => {
		dispatch(walletConnectOperations.transactionApproveOperation());
	};

	return (
		<TransactionComponent
			address={address}
			tx={tx}
			method={method}
			peerMeta={peerMeta}
			onCancel={handleCancel}
			onApprove={handleApprove}
		/>
	);
};

export default TransactionContainer;
