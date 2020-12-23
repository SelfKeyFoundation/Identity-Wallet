import React, { useCallback, useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { contractSelectors, contractOperations } from '../../../common/contract';
import { getERC20Tokens, getTokenByAddress } from '../../../common/wallet-tokens/selectors';
import { AllowanceEditor } from './allowance-editor';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import { getLocale } from '../../../common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { pricesSelectors } from 'common/prices';

export const AllowanceEditorContainer = props => {
	const tokens = useSelector(getERC20Tokens, shallowEqual);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(ethGasStationInfoOperations.loadData());
		dispatch(contractOperations.loadAllowancesOperation());
		dispatch(contractOperations.loadContractsOperation());
	}, []);

	const editor = useSelector(
		contractSelectors.selectAllowanceEditor.bind(contractSelectors),
		shallowEqual
	);

	const ethGasStationInfo = useSelector(
		ethGasStationInfoSelectors.getEthGasStationInfo,
		shallowEqual
	);

	const { locale = 'en' } = useSelector(getLocale, shallowEqual);

	const { fiatCurrency = 'USD' } = useSelector(getFiatCurrency, shallowEqual);

	const selectedToken = useSelector(state =>
		getTokenByAddress(state, editor.tokenAddress, shallowEqual)
	);

	const ethRate = useSelector(state => pricesSelectors.getRate(state, 'ETH', fiatCurrency));

	const handleTokenChange = useCallback(token => {
		const tokenAddress = token ? token.address : null;
		dispatch(contractOperations.updateAllowanceEditorOperation({ tokenAddress }));
	});

	const handleContractAddressChange = useCallback(contractAddress => {
		dispatch(contractOperations.updateAllowanceEditorOperation({ contractAddress }));
	});

	const handleAmountChange = useCallback(amount => {
		dispatch(contractOperations.updateAllowanceEditorOperation({ amount }));
	});

	const handleGasLimitChange = useCallback(gas => {
		dispatch(contractOperations.updateAllowanceEditorOperation({ gas }));
	});

	const handleGasPriceChange = useCallback(gasPrice => {
		dispatch(contractOperations.updateAllowanceEditorOperation({ gasPrice }));
	});

	const handleNonceChange = useCallback(nonce => {
		dispatch(contractOperations.updateAllowanceEditorOperation({ nonce }));
	});

	const handleGasStationReload = useCallback(() => {
		dispatch(ethGasStationInfoOperations.loadData());
	});

	const handleEditorCancel = useCallback(() => {
		dispatch(contractOperations.cancelAllowanceEditorOperation());
	});
	const handleEditorConfirm = useCallback(() => {
		dispatch(contractOperations.submitAllowanceEditorOperation());
	});

	return (
		<AllowanceEditor
			{...props}
			{...editor}
			selectedToken={selectedToken}
			tokens={tokens}
			locale={locale}
			fiatCurrency={fiatCurrency}
			{...ethGasStationInfo}
			ethRate={ethRate}
			onTokenChange={handleTokenChange}
			onContractAddressChange={handleContractAddressChange}
			onAmountChange={handleAmountChange}
			onGasLimitChange={handleGasLimitChange}
			onGasPriceChange={handleGasPriceChange}
			onGasStationReload={handleGasStationReload}
			onNonceChange={handleNonceChange}
			onCancel={handleEditorCancel}
			onConfirm={handleEditorConfirm}
		/>
	);
};
