import React, { useCallback } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { contractSelectors, contractOperations } from '../../../common/contract';
import { getERC20Tokens, getTokenByAddress } from '../../../common/wallet-tokens/selectors';
import { AllowanceEditor } from './allowance-editor';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import { getLocale } from '../../../common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';

export const AllowanceEditorContainer = props => {
	const tokens = useSelector(getERC20Tokens, shallowEqual);
	const dispatch = useDispatch();

	const editor = useSelector(
		contractSelectors.selectAllowanceEditor.bind(contractSelectors),
		shallowEqual
	);

	const ethGasStationInfo = useSelector(
		ethGasStationInfoSelectors.getEthGasStationInfo,
		shallowEqual
	);

	const locale = useSelector(getLocale, shallowEqual);

	const fiatCurrency = useSelector(getFiatCurrency);

	const selectedToken = useSelector(state =>
		getTokenByAddress(state, editor.tokenAddress, shallowEqual)
	);

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

	const handleGasStationReload = useCallback(() => {
		dispatch(ethGasStationInfoOperations.loadData());
	});

	return (
		<AllowanceEditor
			{...props}
			{...editor}
			selectedToken={selectedToken}
			tokens={tokens}
			locale={locale}
			{...fiatCurrency}
			ethGasStationInfo={ethGasStationInfo}
			onTokenChange={handleTokenChange}
			onContractAddressChange={handleContractAddressChange}
			onAmountChange={handleAmountChange}
			onGasLimitChange={handleGasLimitChange}
			onGasPriceChange={handleGasPriceChange}
			onGasStationReload={handleGasStationReload}
		/>
	);
};
