import React, { useEffect, useCallback } from 'react';
import { ContractAllowanceList } from './allowance-list';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { getERC20Tokens, getTokenBySymbol } from 'common/wallet-tokens/selectors';
import { contractSelectors, contractOperations } from '../../../common/contract';
import { push } from 'connected-react-router';

export const ContractAllowanceListContainer = React.memo(({ match }) => {
	const { selectedToken } = match.params;
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(contractOperations.loadAllowancesOperation());
		dispatch(contractOperations.loadContractsOperation());
	}, []);

	const token = useSelector(state => getTokenBySymbol(state, selectedToken), shallowEqual);
	const allowances = useSelector(
		state =>
			contractSelectors.selectAllowancesByTokenAddress(state, token ? token.address : null),
		shallowEqual
	);
	const tokens = useSelector(getERC20Tokens, shallowEqual);

	const handleTokenChange = useCallback(async token => {
		await dispatch(push(`/main/allowance-list/${token ? token.symbol : ''}`));
	});

	const handleAllowanceAdd = useCallback(async symbol => {
		await dispatch(
			contractOperations.startAllowanceEditorOperation({
				symbol,
				cancelPath: match.url,
				nextPath: match.url
			})
		);
	});

	const handleAllowanceEdit = useCallback(async allowance => {
		await dispatch(
			contractOperations.startAllowanceEditorOperation({
				...allowance,
				fixed: true,
				cancelPath: match.url,
				nextPath: match.url
			})
		);
	});

	return (
		<ContractAllowanceList
			selectedToken={selectedToken}
			tokens={tokens}
			allowances={allowances}
			onTokenChange={handleTokenChange}
			onAllowanceAdd={handleAllowanceAdd}
			onAllowanceEdit={handleAllowanceEdit}
		/>
	);
});
