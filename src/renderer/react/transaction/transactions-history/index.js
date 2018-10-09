import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import { TransactionHistory } from 'selfkey-ui';

export const TransactionsHistoryWrapper = props => {
	return (
		<Provider store={store}>
			<TransactionHistory {...props} />
		</Provider>
	);
};

export default TransactionsHistoryWrapper;
