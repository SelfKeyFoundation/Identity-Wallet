import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import Exchanges from './containers/exchanges';

export const ExchangesWrapper = props => {
	console.log('Props', props);

	return (
		<Provider store={store}>
			<Exchanges {...props} />
		</Provider>
	);
};

export default ExchangesWrapper;
