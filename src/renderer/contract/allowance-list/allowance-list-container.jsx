import React from 'react';
import { ContractAllowanceList } from './allowance-list';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { getERC20Tokens, getTokenBySymbol } from 'common/wallet-tokens/selectors';
import { contractSelectors, contractOperations } from '../../../common/contract';
import { push } from 'connected-react-router';

export const ContractAllowanceListContainer = React.memo(({ match }) => {
	const { selectedToken } = match.params;
	const dispatch = useDispatch();
	const tokenAddress = useSelector(state => getTokenBySymbol(state, selectedToken), shallowEqual);
	const allowances = useSelector(
		state => contractSelectors.selectAllowancesByTokenAddress(state, tokenAddress),
		shallowEqual
	);
	const tokens = useSelector(getERC20Tokens, shallowEqual);

	const handleTokenChange = async token => {
		await dispatch(push(`/main/allowance-list/${token ? token.symbol : ''}`));
	};

	const handleAllowanceAdd = async symbol => {
		await dispatch(
			contractOperations.startAllowanceEditorOperation({
				symbol,
				cancelPath: window.location.href,
				nextPath: window.location.href
			})
		);
	};

	return (
		<ContractAllowanceList
			selectedToken={selectedToken}
			tokens={tokens}
			allowances={allowances}
			onTokenChange={handleTokenChange}
			onAllowanceAdd={handleAllowanceAdd}
		/>
	);
});
