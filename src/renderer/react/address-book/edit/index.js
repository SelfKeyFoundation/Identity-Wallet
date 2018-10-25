import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';

import AddressBookEdit from './containers/address-book-edit';

export const AddressBookEditWrapper = props => {
	return (
		<Provider store={store}>
			<AddressBookEdit {...props} />
		</Provider>
	);
};

export default AddressBookEditWrapper;
