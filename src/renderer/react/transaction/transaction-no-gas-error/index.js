import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import TransactionNoGasError from './containers/transaction-no-gas-error';

export const TransactionNoGasErrorWrapper = props => {
	return (
		<Provider store={store}>
			<TransactionNoGasError {...props} />
		</Provider>
	);
};

export default TransactionNoGasErrorWrapper;
