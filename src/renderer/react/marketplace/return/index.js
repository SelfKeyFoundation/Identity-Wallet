import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import UnlockContainer from './containers/return';
import { UnlockBox } from 'selfkey-ui';

export const ReturnWrapper = props => {
	return (
		<Provider store={store}>
			<UnlockBox closeAction={props.closeAction}>
				<UnlockContainer {...props} />
			</UnlockBox>
		</Provider>
	);
};

export default ReturnWrapper;
