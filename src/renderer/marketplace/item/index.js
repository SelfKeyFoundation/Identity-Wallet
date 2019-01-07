import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import Item from './containers/item';

export const ItemWrapper = props => {
	return (
		<Provider store={store}>
			<Item {...props} />
		</Provider>
	);
};

export default ItemWrapper;
