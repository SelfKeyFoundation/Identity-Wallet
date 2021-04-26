import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
// import { walletConnectOperations, walletConnectSelectors } from '../../common/wallet-connect';
// import { walletConnectSelectors } from '../../common/wallet-connect';
import { WcPasteQRCodeComponent } from './wc-paste-qr-code-component';
import { getWallet } from '../../common/wallet/selectors';
import { walletConnectOperations } from '../../common/wallet-connect';

export const WcPasteQRCodeContainer = () => {
	const dispatch = useDispatch();

	const wallet = useSelector(getWallet);
	const address = wallet ? wallet.address : undefined;

	const [connectionString, setConnectionString] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const handleCancel = () => dispatch(push('/main/dashboard'));

	const handleConnect = () => {
		setIsLoading(true);
		dispatch(walletConnectOperations.handleUriOperation(connectionString));
	};

	const handleChangeConnectionString = evt => setConnectionString(evt.target.value);

	return (
		<WcPasteQRCodeComponent
			isLoading={isLoading}
			address={address}
			connectionString={connectionString}
			onCancel={handleCancel}
			onChangeConnectionString={handleChangeConnectionString}
			onConnect={handleConnect}
		/>
	);
};

export default WcPasteQRCodeContainer;
