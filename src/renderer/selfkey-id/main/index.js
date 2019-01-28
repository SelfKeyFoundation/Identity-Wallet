import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';

import SelfkeyId from './containers/selfkey-id';
import { SelfkeyDarkTheme } from 'selfkey-ui';

export const SelfkeyIdWrapper = props => {
	return (
		<SelfkeyDarkTheme>
			<Provider store={store}>
				<SelfkeyId {...props} />
			</Provider>
		</SelfkeyDarkTheme>
	);
};

export default SelfkeyIdWrapper;
