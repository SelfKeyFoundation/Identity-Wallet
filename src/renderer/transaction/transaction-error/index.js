import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import TransactionError from './containers/transaction-error';

export const TransactionErrorWrapper = props => {
	return (
		<Provider store={store}>
			<TransactionError {...props} />
		</Provider>
	);
};

export default TransactionErrorWrapper;
