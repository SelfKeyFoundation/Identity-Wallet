import React from 'react';
import { Provider } from 'react-redux';
import store from '../common/store';
import PriceBox from './containers/price-box';

export const PriceBoxWrapper = props => {
	return (
		<Provider store={store}>
			<PriceBox {...props} />
		</Provider>
	);
};

export default PriceBoxWrapper;
