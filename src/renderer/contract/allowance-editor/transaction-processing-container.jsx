import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { contractOperations } from '../../../common/contract';
import TransactionProcessingPopup from '../../common/transaction-processing-popup';

export const TransactionProcessingContainer = React.memo(() => {
	const dispatch = useDispatch();
	const handleClose = useCallback(() => {
		dispatch(contractOperations.cancelAllowanceEditorOperation());
	});

	return <TransactionProcessingPopup closeAction={handleClose} title="Transaction in progress" />;
});
