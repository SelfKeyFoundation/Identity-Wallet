import React, { useEffect } from 'react';
import { withNavFlow } from '../navigation/with-flow-hoc';
import { useDispatch, useSelector } from 'react-redux';
import { moonPayOperations, moonPaySelectors } from '../../common/moonpay';
import { TransactionLoadingModal } from './transaction-loading-modal';

export const MoonPayTransactionCheckContainer = withNavFlow(
	props => {
		const transaction = useSelector(moonPaySelectors.getTransaction);
		const dispatch = useDispatch();
		useEffect(() => {
			setTimeout(() => {
				dispatch(moonPayOperations.refreshTransactionOperation());
			}, 20000);
		}, []);

		const handleStatusClick = e => {
			const url = `https://buy.moonpay.com/transaction_receipt?transactionId=${
				transaction.id
			}`;
			window.openExternal(e, url);
		};
		return (
			<TransactionLoadingModal
				{...props}
				title="Waiting for transaction to complete"
				onStatusClick={handleStatusClick}
			/>
		);
	},
	{ next: null }
);

export default MoonPayTransactionCheckContainer;
