import React from 'react';
import { Provider } from 'react-redux';
import store from '../common/store';
import CryptoChartBox from './containers/crypto-chart-box';
import CryptoPriceTable from './containers/crypto-price-table';

export const CryptoChartBoxWrapper = props => {
	return (
		<Provider store={store}>
			<CryptoChartBox {...props} />
		</Provider>
	);
};

// TODO: make a util to wrap containers
export const CryptoPriceTableWrapper = props => {
	return (
		<Provider store={store}>
			<CryptoPriceTable {...props} />
		</Provider>
	);
};
