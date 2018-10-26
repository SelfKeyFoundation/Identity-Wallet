import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';

import AddressBookAdd from './containers/address-book-add';

export const AddressBookAddWrapper = props => {
	return (
		<Provider store={store}>
			<AddressBookAdd {...props} />
		</Provider>
	);
};

export default AddressBookAddWrapper;
