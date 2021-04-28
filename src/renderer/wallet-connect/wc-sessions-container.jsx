import React, { useEffect } from 'react';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { walletConnectOperations, walletConnectSelectors } from '../../common/wallet-connect';
import WcSessionsComponent from './wc-sessions-component';

export const WcSessionsContainer = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(walletConnectOperations.loadSessionsOperation());
	}, []);

	const { sessions } = useSelector(walletConnectSelectors.selectWalletConnect);

	const handleCancel = () => dispatch(push('/wallet-connect/connect'));

	const handleDeleteSession = session => {
		dispatch(walletConnectOperations.deleteSessionOperation(session));
	};

	return (
		<WcSessionsComponent
			sessions={sessions}
			onCancel={handleCancel}
			onDeleteSession={handleDeleteSession}
		/>
	);
};

export default WcSessionsContainer;
