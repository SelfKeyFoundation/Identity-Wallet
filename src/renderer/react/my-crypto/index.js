import React from 'react';
import { Provider } from 'react-redux';
import store from '../common/store';
import CryptoChartBox from './containers/crypto-chart-box';

export const CryptoChartBoxWrapper = props => {
	return (
		<Provider store={store}>
			<CryptoChartBox {...props} />
		</Provider>
	);
};

export default CryptoChartBoxWrapper;
