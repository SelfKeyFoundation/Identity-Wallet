import React from 'react';
import { Provider } from 'react-redux';
import store from '../common/store';

import AddressBook from './containers/address-book';

export const AddressBookWrapper = props => {
	return (
		<Provider store={store}>
			<AddressBook />
		</Provider>
	);
};

export default AddressBookWrapper;
