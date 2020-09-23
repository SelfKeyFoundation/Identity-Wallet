import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { contractSelectors } from '../../../common/contract';
import { getERC20Tokens } from '../../../common/wallet-tokens/selectors';
import { AllowanceEditor } from './allowance-editor';

export const AllowanceEditorContainer = props => {
	const tokens = useSelector(getERC20Tokens, shallowEqual);
	const editor = useSelector(
		contractSelectors.selectAllowanceEditor.bind(contractSelectors),
		shallowEqual
	);

	return <AllowanceEditor {...props} {...editor} tokens={tokens} />;
};
