import React, { useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { walletConnectOperations, walletConnectSelectors } from '../../common/wallet-connect';
import { ethGasStationInfoOperations, ethGasStationInfoSelectors } from 'common/eth-gas-station';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { pricesSelectors } from 'common/prices';
import { getLocale } from 'common/locale/selectors';
// import { getTokens } from 'common/wallet-tokens/selectors';
import TransactionComponent from './transaction-component';
import { getWallet } from '../../common/wallet/selectors';
// import { getERC20Tokens, getTokenByAddress } from 'common/wallet-tokens/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';

export const TransactionContainer = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(ethGasStationInfoOperations.loadData());
	}, []);

	const { ethGasStationInfo } = useSelector(ethGasStationInfoSelectors.getEthGasStationInfo);
	const { fiatCurrency = 'USD' } = useSelector(getFiatCurrency);
	const locale = useSelector(getLocale);
	const ethRate = useSelector(state => pricesSelectors.getRate(state, 'ETH', fiatCurrency));
	// const tokens = useSelector(getTokens);
	const tokens = useSelector(getTokens, shallowEqual);

	const { peerMeta, tx, method } = useSelector(walletConnectSelectors.selectWalletConnect);

	console.log(tx);
	console.log(tokens);

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
			locale={locale}
			address={address}
			fiatCurrency={fiatCurrency}
			ethRate={ethRate}
			tx={tx}
			method={method}
			peerMeta={peerMeta}
			onCancel={handleCancel}
			onApprove={handleApprove}
			ethGasStationInfo={ethGasStationInfo}
			nonce={''}
		/>
	);
};

export default TransactionContainer;
