import React from 'react';
import { withNavFlow } from '../navigation/with-flow-hoc';
import { useSelector } from 'react-redux';
import MoonPayTransactionResultModal from './transaction-result-modal';
import { moonPaySelectors } from '../../common/moonpay';

export const MoonPayTransactionFailedContainer = withNavFlow(
	props => {
		const { onCancel } = props;

		const transaction = useSelector(moonPaySelectors.getTransaction);

		const handleDetailsClick = e => {
			const url = `https://buy.moonpay.com/transaction_receipt?transactionId=${
				transaction.id
			}`;
			window.openExternal(e, url);
		};

		return (
			<MoonPayTransactionResultModal
				transaction={transaction}
				onCancel={onCancel}
				onDetailsClick={handleDetailsClick}
			/>
		);
	},
	{
		next: '/main/moonpay/loading/payment-flow'
	}
);

export default MoonPayTransactionFailedContainer;
