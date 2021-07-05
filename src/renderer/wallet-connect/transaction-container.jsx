import React, { useEffect, useState } from 'react';
import EthUtils from 'common/utils/eth-utils';
import EthUnits from 'common/utils/eth-units';
import { useSelector, useDispatch } from 'react-redux';
import { walletConnectOperations, walletConnectSelectors } from '../../common/wallet-connect';
import { ethGasStationInfoOperations, ethGasStationInfoSelectors } from 'common/eth-gas-station';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { pricesSelectors } from 'common/prices';
import { getLocale } from 'common/locale/selectors';
import TransactionComponent from './transaction-component';
import { getWallet } from '../../common/wallet/selectors';

export const TransactionContainer = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(ethGasStationInfoOperations.loadData());
	}, []);

	const { ethGasStationInfo } = useSelector(ethGasStationInfoSelectors.getEthGasStationInfo);
	const { fiatCurrency = 'USD' } = useSelector(getFiatCurrency);
	const locale = useSelector(getLocale);
	const ethRate = useSelector(state => pricesSelectors.getRate(state, 'ETH', fiatCurrency));
	const { peerMeta, tx, method, rawTx, nonce: defaultNonce } = useSelector(
		walletConnectSelectors.selectWalletConnect
	);

	const [gasPrice, setGasPrice] = useState(tx.gasPrice);
	const [gasLimit, setGasLimit] = useState(tx.gas);
	const [nonce, setNonce] = useState(tx.nonce ? tx.nonce : defaultNonce);

	const wallet = useSelector(getWallet);
	const address = wallet ? wallet.address : undefined;

	const handleGasLimitChange = value => setGasLimit(value);
	const handleGasPriceChange = value => setGasPrice(value);
	const handleNonceChange = value => setNonce(value);
	const handleReloadGasStation = () => dispatch(ethGasStationInfoOperations.loadData());

	const handleCancel = () => {
		dispatch(walletConnectOperations.transactionDenyOperation());
	};

	const handleApprove = async () => {
		const newTx = { ...rawTx };
		if (gasLimit) {
			newTx.gas = EthUtils.sanitizeHex(EthUtils.decimalToHex(gasLimit));
		}
		if (gasPrice) {
			const gasPriceInWei = EthUnits.unitToUnit(gasPrice, 'gwei', 'wei');
			newTx.gasPrice = EthUtils.sanitizeHex(EthUtils.decimalToHex(gasPriceInWei));
		}
		if (nonce) {
			newTx.nonce = nonce;
		}
		await dispatch(walletConnectOperations.setSessionAction({ rawTx: newTx }));
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
			handleGasLimitChange={handleGasLimitChange}
			handleGasPriceChange={handleGasPriceChange}
			handleNonceChange={handleNonceChange}
			reloadEthGasStationInfoAction={handleReloadGasStation}
			gasPrice={gasPrice}
			gasLimit={gasLimit}
			nonce={nonce}
		/>
	);
};

export default TransactionContainer;
