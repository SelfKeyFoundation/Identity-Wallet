import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { contractOperations } from '../../../common/contract';
import TransactionErrorPopup from '../../common/transaction-error-popup';

export const TransactionErrorContainer = React.memo(() => {
	const dispatch = useDispatch();
	const handleClose = useCallback(() => {
		dispatch(contractOperations.cancelAllowanceEditorOperation());
	});

	return <TransactionErrorPopup closeAction={handleClose} title="Transaction Error" />;
});
